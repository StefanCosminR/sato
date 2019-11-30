//
//  Node.swift
//  
//
//  Created by Stefan Romanescu on 30/11/2019.
//

public struct Node {
    private let library: DocLibrary
    
    init(using library: DocLibrary) {
        self.library = library
    }
    
    
    /// Reads contents of directories for all versions of a library and returns them as a dictionary
    /// that contains as key the version and as value an array with the name of the found articles
    func getArticles() -> [String: [String]] {
        
    }
}
