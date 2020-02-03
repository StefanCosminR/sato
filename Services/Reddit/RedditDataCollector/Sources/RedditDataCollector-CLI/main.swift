// Create by Stefan Romanescu on 29/12/2019 
// Using Swift 5.0

import Foundation
import RedditDataCollector

guard CommandLine.arguments.count == 2 else {
    print("""
    RedditDataCollector "/path/to/output/rdf.ttl"
    -------------------------------
    You must pass the path for the output turtle file.
    """)
    exit(0)
}

let outputTurtleFilePath = CommandLine.arguments[1]
let semaphore = DispatchSemaphore(value: 0)
let anotherSemaphore = DispatchSemaphore(value: 0)
let headers = """
@prefix : <http://www.semanticweb.org/wade/ontologies/sato#> .
@prefix wd: <http://www.wikidata.org/entity/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@base <http://www.semanticweb.org/wade/ontologies/sato> .\n\n
"""

print("Getting reddit posts")
RedditAPI.getPosts(for: .programming) { result in
    defer { semaphore.signal() }
    switch result {
    case .success(let redditPosts):
        print("Transforming posts to turtle")
        let turtle = transformRedditPostsToTurtle(redditPosts)
        
        RedditAPI.getPosts(for: .technology, onCompletion: { result in
            defer { anotherSemaphore.signal()}
            switch result {
            case .success(let technologyPosts):
                let technologyTurtle = transformRedditPostsToTurtle(technologyPosts)
                
                let combinedTurtle = headers + turtle + "\n\n\n" + technologyTurtle
                
                print("Writing turtle file to \(outputTurtleFilePath)")
                let outputFile = URL(fileURLWithPath: outputTurtleFilePath)
                
                do {
                    try combinedTurtle.write(to: outputFile, atomically: false, encoding: .utf8)
                } catch(let error) {
                    print(error)
                    fatalError(error.localizedDescription)
                }
            case .failure(let error):
                fatalError(error.localizedDescription)
            }
            
            
        })
        
        
    case .failure(let error):
        print(error)
        fatalError(error.localizedDescription)
    }
}

semaphore.wait()
anotherSemaphore.wait()
