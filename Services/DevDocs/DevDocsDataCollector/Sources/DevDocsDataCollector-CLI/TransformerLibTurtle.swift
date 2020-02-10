// Create by Stefan Romanescu on 23/12/2019 
// Using Swift 5.0

import Foundation
import DevDocsDataCollector

public func transformLibrariesToTurtle(_ libraries: [String: Library]) -> String {
    var turtle = """
    @prefix : <http://www.semanticweb.org/wade/ontologies/sato#> .
    @prefix wd: <http://www.wikidata.org/entity/> .
    @prefix owl: <http://www.w3.org/2002/07/owl#> .
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix xml: <http://www.w3.org/XML/1998/namespace> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @base <http://www.semanticweb.org/wade/ontologies/sato> .\n\n\n
    """
    let devdocsUrl = "https://devdocs.io/"
    
    for library in libraries.values {
        let meta = library.meta
        let libraryName = ":\(library.name)"
        
        let topic = "\(libraryName) rdf:type :Topic .\n"
        var entriesTurtle = "<\(devdocsUrl)\(library.name)> :hasTopic \(libraryName) .\n"
        
//        for tutorial in meta.entries {
//            guard !tutorial.path.contains(where: {c in c == "<" || c == ">"}) else { continue }
//            guard !tutorial.path.contains("peg") else { continue }
//            guard !tutorial.name.contains("$") else { continue }
//
//            guard let escapedPath = tutorial.path.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) else { continue }
//            let tutorialPath = "\(devdocsUrl)\(meta.slug)/\(escapedPath)"
//
//            let escapedName = tutorial.name
//                .replacingOccurrences(of: #"\"#, with: #"\\"#)
//                .replacingOccurrences(of: "\'", with: #"\'"#)
//                .replacingOccurrences(of: "$", with: #"\$"#)
//
//            entriesTurtle += "<\(tutorialPath)> rdf:type :Tutorial .\n"
//            entriesTurtle += "<\(tutorialPath)> rdfs:label '''\(escapedName)'''^^xsd:string .\n"
//            entriesTurtle += "<\(tutorialPath)> :hasTopic \(libraryName) .\n\n"
//
//        }
        
        turtle += "\(topic)\(entriesTurtle)\n"
    }
    
    return turtle
}
