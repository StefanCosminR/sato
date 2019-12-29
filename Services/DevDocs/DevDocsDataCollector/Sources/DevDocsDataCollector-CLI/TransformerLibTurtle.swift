// Create by Stefan Romanescu on 23/12/2019 
// Using Swift 5.0

import Foundation
import DevDocsDataCollector

public func transformLibrariesToTurtle(_ libraries: [String: Library]) -> String {
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
