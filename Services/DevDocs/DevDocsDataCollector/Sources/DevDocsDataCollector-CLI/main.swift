// Create by Stefan Romanescu on 04/12/2019 
// Using Swift 5.0

import Foundation
import DevDocsDataCollector

guard CommandLine.arguments.count == 3 else {
    print("""
    DevDocsDataCollector "/path/to/DevDocs/public/docs" "/path/to/output/rdf.ttl"
    -------------------------------
    Pass the input to the DevDocs cloned repository
    and the path where the parsed output should be written to
    """)
    exit(0)
}

let devDocsSourceFolder = CommandLine.arguments[1]
let outputTurtleFile = CommandLine.arguments[2]

print("Getting libraries from folder \(devDocsSourceFolder)")
let libraries = try Library.getLibraries(atPath: devDocsSourceFolder)

print("Creating turtle")
let turtle = transformLibrariesToTurtle(libraries)

print("Writing output to \(outputTurtleFile)")
let outputFile = URL(fileURLWithPath: outputTurtleFile)

try turtle.write(to: outputFile, atomically: false, encoding: .utf8)

