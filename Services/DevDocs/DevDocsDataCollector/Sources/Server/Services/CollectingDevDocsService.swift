// Create by Stefan Romanescu on 05/01/2020 
// Using Swift 5.0

import AsyncHTTPClient
import NIO
import DevDocsDataCollector
import DevDocsDataCollector_CLI

struct CollectingDevDocsService {
    
    func collectAndSendToDB(eventLoop: EventLoop) -> EventLoopFuture<Void> {
        let promise = eventLoop.makePromise(of: Void.self)
        
        do {
            let libraries = try Library.getLibraries(atPath: Config.devDocsFolder)
            let turtle = self.transformLibrariesToTurtle(libraries)
            let httpClient = HTTPClient(eventLoopGroupProvider: .shared(eventLoop))
            
            beginTransaction(for: eventLoop, usingClient: httpClient)
                .flatMap { token in self.addToTransaction(for: eventLoop, usingClient: httpClient, token: token, body: turtle)}
                .flatMap { token in self.commitTransaction(for: eventLoop, usingClient: httpClient, token: token) }
                .whenComplete { result in
                    switch result {
                    case .failure(let error):
                        promise.fail(error)
                    case .success():
                        promise.succeed(Void())
                    }
            }
            
            
        } catch {
            promise.fail(error)
        }
        
        return promise.futureResult
    }
    
    private func beginTransaction(for eventLoop: EventLoop, usingClient httpClient: HTTPClient) -> EventLoopFuture<String> {
        let promise = eventLoop.makePromise(of: String.self)
        
        guard var request = try? HTTPClient.Request(url: "http://0.0.0.0:5820/test/transaction/begin?reasoning=false", method: .POST) else {
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
            var request = try HTTPClient.Request(url: "http://0.0.0.0:5820/test/\(token)/add", method: .POST)
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
            
            var request = try HTTPClient.Request(url: "http://0.0.0.0:5820/test/transaction/commit/\(token)", method: .POST)
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
    
    private func transformLibrariesToTurtle(_ libraries: [String: Library]) -> String {
        var turtle = ""
        let devdocsUrl = "https://devdocs.io/"
        
        for library in libraries.values {
            let meta = library.meta
            let libraryName = ":\(library.name)"
            
            let topic = "\(libraryName) rdf:type :Topic .\n"
            var entriesTurtle = ""
            
            for tutorial in meta.entries {
                guard !tutorial.path.contains(where: {c in c == "<" || c == ">"}) else { continue }
                guard !tutorial.path.contains("peg") else { continue }
                guard !tutorial.name.contains("$") else { continue }
                
                guard let escapedPath = tutorial.path.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) else { continue }
                let tutorialPath = "\(devdocsUrl)\(meta.slug)/\(escapedPath)"
                
                let escapedName = tutorial.name
                    .replacingOccurrences(of: #"\"#, with: #"\\"#)
                    .replacingOccurrences(of: "\'", with: #"\'"#)
                    .replacingOccurrences(of: "$", with: #"\$"#)
                
                entriesTurtle += "<\(tutorialPath)> rdf:type :Tutorial .\n"
                entriesTurtle += "<\(tutorialPath)> rdfs:label '''\(escapedName)'''^^xsd:string .\n"
                entriesTurtle += "<\(tutorialPath)> :hasTopic \(libraryName) .\n\n"
                
            }
            
            turtle += "\(topic)\(entriesTurtle)\n"
        }
        
        return turtle
    }
    
    enum Errors: Error {
        
        case CouldNotParseBody
        case UnknownError(_ message: String)
    }
}
