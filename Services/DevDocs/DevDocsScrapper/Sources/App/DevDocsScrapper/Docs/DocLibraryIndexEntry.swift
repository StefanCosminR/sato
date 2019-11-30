//
//  DocLibraryIndexEntry.swift
//  
//
//  Created by Stefan Romanescu on 30/11/2019.
//

import Foundation

public struct DocLibraryIndex: Codable {
    let entries: [DocLibraryIndexEntry]
}

public struct DocLibraryIndexEntry: Codable {
    let name: String
    let path: String
    let type: String
}
