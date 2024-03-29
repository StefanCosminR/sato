// Create by Stefan Romanescu on 29/12/2019 
// Using Swift 5.0

import Foundation
import RedditDataCollector

public func transformRedditPostsToTurtle(_ posts: [RedditPost]) -> String {
    var turtle = ""
    
    var alreadyProcessedTags: Set<String> = Set()
    
    for post in posts {
        let subject = post.url.absoluteString
        let label = post.title
            .replacingOccurrences(of: #"\"#, with: #"\\"#)
            .replacingOccurrences(of: "\'", with: #"\'"#)
        
        var localTurtleEntry = ""
        
        let resourceType = getResourceType(for: post)
        
        localTurtleEntry += "<\(subject)> rdf:type \(resourceType) .\n"
        localTurtleEntry += "<\(subject)> rdfs:label '''\(label)'''^^xsd:string .\n"
        
        // retrieved on conversion and saving
        let date = Date(timeIntervalSince1970: TimeInterval(post.retrievedOn))
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let retrievedOn = dateFormatter.string(from: date)
        localTurtleEntry += "<\(subject)> :createdAt '''\(retrievedOn)'''^^xsd:date .\n"
        
        for tag in post.tags {
            
            if let wikidataId = tag.wikidataId {
                localTurtleEntry += "<\(subject)> :hasTopic wd:\(wikidataId) .\n"
            }
            
            if let extraLink = tag.extraLink {
                defer {
                    localTurtleEntry += "<\(subject)> :hasTopic <\(extraLink)> .\n"
                }
                
                guard !alreadyProcessedTags.contains(extraLink) else { continue }
                alreadyProcessedTags.insert(extraLink)
                
                localTurtleEntry += "<\(extraLink)> rdf:type :Topic .\n"
                localTurtleEntry += "<\(extraLink)> rdfs:label '''\(tag.name)'''^^xsd:string .\n"
            } else {
                let tagName = tag.name.replacingOccurrences(of: " ", with: "-")
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

private func getResourceType(for post: RedditPost) -> String {
    if post.url.absoluteString.contains("youtu") {
        return ":Tutorial"
    } else if post.url.absoluteString.contains("github") {
        return ":Repository"
    } else if post.subreddit == Subreddit.technology.rawValue {
        return ":News"
    } else {
        return ":Article"
    }
}
