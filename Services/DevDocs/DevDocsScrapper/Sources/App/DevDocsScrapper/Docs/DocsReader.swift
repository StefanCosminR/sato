//
//  DocsReader.swift
//
//
//  Created by Stefan Romanescu on 30/11/2019.
//

import Foundation

public struct DocsReader {
    public private(set) var folderPath: String
    public private(set) var libraries: [String: DocLibrary]

    public init(folderPath: String) {
        self.folderPath = folderPath
        libraries = [:]
    }
}

extension DocsReader {
    public mutating func populateContents() throws {
        let fm = FileManager.default

        let contents = try fm.contentsOfDirectory(atPath: folderPath)

        libraries = contents
            .map({ $0.split(separator: "~") })
            .reduce(into: [:]) { libraries, libraryVersionPair in
                let hasVersion = libraryVersionPair.count > 1

                let libraryName = String(libraryVersionPair[0])
                var currentVersion = ""

                if hasVersion {
                    currentVersion = String(libraryVersionPair[1])
                }

                var library = libraries[libraryName] ?? DocLibrary(rootFolder: folderPath, name: libraryName)
                library.addVersion(currentVersion)

                libraries[libraryName] = library
            }
    }
}
