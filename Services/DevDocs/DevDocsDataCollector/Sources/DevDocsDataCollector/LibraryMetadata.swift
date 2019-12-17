// Create by Stefan Romanescu on 15/12/2019
// Using Swift 5.0

import Foundation

public struct LibraryMetadata: Codable {
    public var code: URL
    public var entries: [LibraryEntry] = []
    public var home: URL
    public var name: String = ""
    public var slug: String = ""
    
    public struct LibraryEntry: Codable {
        var name: String
        var url: URL
        var tag: String
    }
    
}

public extension LibraryMetadata {
    static func readLibrary(atPath libraryFolder: String) -> LibraryMetadata? {
        
        let metaFilePath = URL(fileURLWithPath: libraryFolder).appendingPathComponent("meta.json")
        let indexFilePath = URL(fileURLWithPath: libraryFolder).appendingPathComponent("index.json")
        
        guard let libraryMetaInfo = readLibraryMetaFile(atPath: metaFilePath) else { return nil }
        guard let libraryIndexInfo = try? readLibraryInfoFile(atPath: indexFilePath) else { return nil }
        
        let libraryMeta = LibraryMetadata(code: libraryMetaInfo.code,
                                          entries: libraryIndexInfo,
                                          home: libraryMetaInfo.home,
                                          name: libraryMetaInfo.name,
                                          slug: libraryMetaInfo.slug)
        
        return libraryMeta
    }
    
    static func readLibraryMetaFile(atPath metaFilePath: URL) -> (code: URL, home: URL, name: String, slug: String)? {
        let fm = FileManager.default
        
        guard let metaFileContents = fm.contents(atPath: metaFilePath.path) else {
            return nil
        }
        
        
        guard let json = try? JSONSerialization.jsonObject(with: metaFileContents, options: .mutableContainers) as? [String: Any] else {
            return nil
        }
        
        guard let name = json["name"] as? String else { return nil }
        guard let slug = json["slug"] as? String else { return nil }
        guard let links = json["links"] as? [String: Any] else { return nil }
        guard let homeURL = links["home"] as? URL else { return nil }
        guard let codeURL = links["code"] as? URL else { return nil }
        
        return (code: codeURL, home: homeURL, name: name, slug: slug)
    }
    
    static func readLibraryInfoFile(atPath indexFilePath: URL) throws -> [LibraryEntry] {
        let fm = FileManager.default
        
        guard let indexFileData = fm.contents(atPath: indexFilePath.path) else {
            throw Errors.FileNotFound(path: indexFilePath.path)
        }
        
        let decoder = JSONDecoder()
        
        struct IndexFile: Decodable { var entries: [LibraryEntry] }
        
        let indexFile = try decoder.decode(IndexFile.self, from: indexFileData)
        
        return indexFile.entries
    }

}

