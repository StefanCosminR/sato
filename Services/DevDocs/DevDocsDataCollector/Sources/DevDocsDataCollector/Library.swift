// Create by Stefan Romanescu on 04/12/2019
// Using Swift 5.0

import Foundation

public struct Library {
    public private(set) var rootFolder: String
    public private(set) var name: String
    public private(set) var meta: LibraryMetadata
    
    public init(rootFolder: String, name: String, meta: LibraryMetadata) {
        self.rootFolder = rootFolder
        self.name = name
        self.meta = meta
    }
}

extension Library {
    public static func getLibraries(atPath rootFolder: String) throws -> [String: Library] {
        var rootFolder = rootFolder
        if !rootFolder.hasSuffix("/") {
            rootFolder += "/"
        }
        
        let fm = FileManager.default
        // TODO: Ensure correct order, otherwise older versions might get priority
        let contents = try fm.contentsOfDirectory(atPath: rootFolder).sorted()
        
        return contents
            .filter { libraryName in !libraryName.hasPrefix(".") }
            .reduce(into: [:], { libraries, libraryName in
                let (name, _) = splitNameAndVersion(fileName: libraryName)
                let libraryPath = rootFolder + libraryName
                
                let metadata = try? LibraryMetadata.readLibrary(atPath: libraryPath)
                if metadata != nil {
                    libraries[name] = Library(rootFolder: libraryPath,
                                              name: name,
                                              meta: metadata!)
                }
                
            })
    }
    
    
    fileprivate static func splitNameAndVersion(fileName: String) -> (name: String, version: String) {
        let splitName = fileName.split(separator: Constants.libraryVersionSeparator)
        
        let name = String(splitName[0])
        var version = ""
        
        if splitName.count > 1 {
            version = String(splitName[1])
        }
        
        return (name, version)
    }
}
