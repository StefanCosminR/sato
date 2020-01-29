// Create by Stefan Romanescu on 05/01/2020 
// Using Swift 5.0

import AsyncHTTPClient
import NIO
import RedditDataCollector
import RedditDataCollector_CLI

struct CollectingRedditService {
    
    func collectAndSendToDB(eventLoop: EventLoop) -> EventLoopFuture<Void> {
        let promise = eventLoop.makePromise(of: Void.self)
        let httpClient = HTTPClient(eventLoopGroupProvider: .shared(eventLoop))
        
        RedditAPI.getPosts(for: .programming) { result in
            switch result {
            case .success(let redditPosts):
                let turtle = self.transformRedditPostsToTurtle(redditPosts)
                
                self.beginTransaction(for: eventLoop, usingClient: httpClient)
                    .flatMap { token in self.addToTransaction(for: eventLoop, usingClient: httpClient, token: token, body: turtle)}
                    .flatMap { token in self.commitTransaction(for: eventLoop, usingClient: httpClient, token: token) }
                    .whenComplete { result in
                        switch result {
                        case .failure(let error):
                            try? httpClient.syncShutdown()
                            promise.fail(error)
                        case .success():
                            try? httpClient.syncShutdown()
                            promise.succeed(Void())
                        }
                }
                
            case .failure(let error):
                try? httpClient.syncShutdown()
                promise.fail(error)
            }
        }
        
        return promise.futureResult
    }
    
    private func beginTransaction(for eventLoop: EventLoop, usingClient httpClient: HTTPClient) -> EventLoopFuture<String> {
        let promise = eventLoop.makePromise(of: String.self)
        
        guard var request = try? HTTPClient.Request(url: "http://ec2-63-33-206-52.eu-west-1.compute.amazonaws.com:5820/sato/transaction/begin?reasoning=false", method: .POST) else {
            promise.fail(Errors.UnknownError("Could not parse url"))
            return promise.futureResult
        }
        
        request.headers.basicAuthorization = .init(username: "admin", password: "admin")
        
        
        httpClient.execute(request: request).whenComplete { result in
            switch result {
            case .failure(let error):
                promise.fail(error)
            case .success(let response):
                guard response.status == .ok else {
                    promise.fail(Errors.UnknownError("Begin transaction not ok \(response.status.code)"))
                    return
                }
                
                var body = response.body
                
                guard let readableBytes = body?.readableBytes,
                    let token = body?.readString(length: readableBytes, encoding: .utf8) else {
                        promise.fail(Errors.CouldNotParseBody)
                        return
                }
                
                promise.succeed(token)
                
            }
        }
        
        return promise.futureResult
    }
    
    private func addToTransaction(for eventLoop: EventLoop,
                                  usingClient httpClient: HTTPClient,
                                  token: String,
                                  body: String) -> EventLoopFuture<String> {
        
        let promise = eventLoop.makePromise(of: String.self)
        
        do {
            var request = try HTTPClient.Request(url: "http://ec2-63-33-206-52.eu-west-1.compute.amazonaws.com:5820/sato/\(token)/add", method: .POST)
            request.body = .string(body)
            request.headers.basicAuthorization = .init(username: "admin", password: "admin")
            request.headers.contentType = .init(type: "text", subType: "turtle")
            
            httpClient.execute(request: request).whenComplete { result in
                switch result {
                case .failure(let error):
                    promise.fail(error)
                case .success(let response):
                    guard response.status == .ok else {
                        promise.fail(Errors.UnknownError("Add not ok \(response.status.code)"))
                        return 
                    }
                    
                    promise.succeed(token)
                }
            }
            
        } catch {
            promise.fail(error)
        }
        
        
        return promise.futureResult
    }
    
    
    private func commitTransaction(for eventLoop: EventLoop, usingClient httpClient: HTTPClient, token: String) -> EventLoopFuture<Void> {
        let promise = eventLoop.makePromise(of: Void.self)
        
        do {
            
            var request = try HTTPClient.Request(url: "http://ec2-63-33-206-52.eu-west-1.compute.amazonaws.com:5820/sato/transaction/commit/\(token)", method: .POST)
            request.headers.basicAuthorization = .init(username: "admin", password: "admin")
            
            httpClient.execute(request: request).whenComplete { result in
                switch result {
                case .failure(let error):
                    promise.fail(error)
                case .success(let response):
                    guard response.status == .ok else {
                        promise.fail(Errors.UnknownError("Commit not ok \(response.status.code)"))
                        return
                    }
                    
                    promise.succeed(Void())
                }
            }
        } catch {
            promise.fail(Errors.UnknownError("Could not parse url"))
        }
        
        return promise.futureResult
    }
    
    private func transformRedditPostsToTurtle(_ posts: [RedditPost]) -> String {
        var turtle = ""
        
        var alreadyProcessedTags: Set<String> = Set()
        
        for post in posts {
            let subject = post.url.absoluteString
            let label = post.title
                .replacingOccurrences(of: #"\"#, with: #"\\"#)
                .replacingOccurrences(of: "\'", with: #"\'"#)
            
            var localTurtleEntry = ""
            
            localTurtleEntry += "<\(subject)> rdf:type :Article .\n"
            localTurtleEntry += "<\(subject)> rdfs:label '''\(label)'''^^xsd:string .\n"
            
            for tag in post.tags {
                
                if let extraLink = tag.extraLink {
                    defer {
                        localTurtleEntry += "<\(subject)> :hasTopic <\(extraLink)> .\n"
                    }
                    
                    guard !alreadyProcessedTags.contains(extraLink) else { continue }
                    alreadyProcessedTags.insert(extraLink)
                    
                    localTurtleEntry += "<\(extraLink)> rdf:type :Topic .\n"
                    localTurtleEntry += "<\(extraLink)> rdfs:label '''\(tag.name)'''^^xsd:string .\n"
                } else {
                    let tagName = tag.name.replacingOccurrences(of: " ", with: "")
                    defer {
                        localTurtleEntry += "<\(subject)> :hasTopic :\(tagName) .\n"
                    }
                    
                    guard !alreadyProcessedTags.contains(tagName) else { continue }
                    alreadyProcessedTags.insert(tagName)
                    
                    localTurtleEntry += ":\(tagName) rdf:type :Topic .\n"
                }
            }
            
            turtle += localTurtleEntry + "\n"
        }
        
        return turtle
    }
    
    enum Errors: Error {
        
        case CouldNotParseBody
        case UnknownError(_ message: String)
    }
}
