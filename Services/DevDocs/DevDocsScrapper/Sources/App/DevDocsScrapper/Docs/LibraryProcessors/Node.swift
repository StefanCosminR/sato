//
//  Node.swift
//  
//
//  Created by Stefan Romanescu on 30/11/2019.
//

import Foundation

public struct Node {
    private let library: DocLibrary
    
    init(using library: DocLibrary) {
        self.library = library
    }
    
    
    /// Reads contents of directories for all versions of a library and returns them as a dictionary
    /// that contains as key the version and as value an array with the name of the found articles
    public func getArticles() throws -> [String: [String]] {
        let fm = FileManager.default
        
        
        let articles = try library.versions
            .map { versionNumber -> (versionNumber: String, libraryPath: String) in
                let libraryURL = URL(fileURLWithPath: library.rootFolder).appendingPathComponent(library.name)
                var libraryPath = libraryURL.path
                
                if versionNumber != "" {
                    libraryPath += "\(DocConfig.LIBRARY_VERSION_SEPARATOR)\(versionNumber)"
                }
                
                return (versionNumber, libraryPath)
            }
            .reduce(into: [:]) {(articles: inout [String: [String]], version: (versionNumber: String, libraryPath: String)) in
                let contents = try fm.contentsOfDirectory(atPath: version.libraryPath)
                articles[version.versionNumber] = contents.filter { $0.hasSuffix(".html")}
            }
        
        return articles
    }
    
    public func getIndexContent() throws -> DocLibraryIndex {
        let indexFileURL = URL(fileURLWithPath: library.rootFolder)
            .appendingPathComponent(library.name)
            .appendingPathComponent("index.json")
        
        let indexFile = try String(contentsOf: indexFileURL, encoding: .utf8)
        guard let indexFileData = indexFile.data(using: .utf8) else {
            throw Errors.CouldNotTransformToData
        }
        let decoder = JSONDecoder()
        
        return try decoder.decode(DocLibraryIndex.self, from: indexFileData)
    }
}
