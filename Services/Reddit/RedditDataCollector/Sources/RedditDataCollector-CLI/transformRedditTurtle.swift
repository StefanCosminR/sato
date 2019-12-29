// Create by Stefan Romanescu on 29/12/2019 
// Using Swift 5.0

import Foundation
import RedditDataCollector

func transformRedditPostsToTurtle(_ posts: [RedditPost]) -> String {
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
