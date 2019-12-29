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

let outputTurtleFile = CommandLine.arguments[1]
let semaphore = DispatchSemaphore( value: 0)

print("Getting reddit posts")
RedditAPI.getPosts(for: .programming) { result in
    defer { semaphore.signal() }
    switch result {
    case .success(let redditPosts):
        print("Transforming posts to turtle")
        let turtle = transformRedditPostsToTurtle(redditPosts)
        
        print("Writing turtle file to \(outputTurtleFile)")
        let outputFile = URL(fileURLWithPath: outputTurtleFile)
        do {
            try turtle.write(to: outputFile, atomically: false, encoding: .utf8)
        } catch(let error) {
            print(error)
            fatalError(error.localizedDescription)
        }
    case .failure(let error):
        print(error)
        fatalError(error.localizedDescription)
    }
}

semaphore.wait()
