//
//  DocLibrary.swift
//  
//
//  Created by Stefan Romanescu on 30/11/2019.
//

import Foundation

public struct DocLibrary {
    public private(set) var rootFolder: String
    public private(set) var name: String
    public private(set) var versions: [String]
    
    public init(rootFolder: String, name: String) {
        self.rootFolder = rootFolder
        self.name = name
        versions = []
    }
}

extension DocLibrary {
    mutating public func addVersion(_ version: String) {
        versions.append(version)
    }
}
