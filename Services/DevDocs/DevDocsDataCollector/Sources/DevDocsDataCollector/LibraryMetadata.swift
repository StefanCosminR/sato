// Create by Stefan Romanescu on 15/12/2019
// Using Swift 5.0

import Foundation

public struct LibraryMetadata: Codable {
    public let code: URL
    public let entries: [LibraryEntry]
    public let home: URL
    public let name: String
    public let slug: String
    
    public struct LibraryEntry: Codable {
        let name: String
        var path: String
        let type: String
    }
    
}


extension LibraryMetadata {
    public static func readLibrary(atPath libraryFolder: String) throws -> LibraryMetadata {
        
        let metaFilePath = URL(fileURLWithPath: libraryFolder).appendingPathComponent("meta.json")
        let indexFilePath = URL(fileURLWithPath: libraryFolder).appendingPathComponent("index.json")
        
        let libraryMetaInfo = try readLibraryMetaFile(atPath: metaFilePath)
        var libraryIndexInfo = try readLibraryIndexFile(atPath: indexFilePath)
        
        libraryIndexInfo = libraryIndexInfo.map { entry in
            var entry = entry
            entry.path = libraryMetaInfo.home.absoluteString + entry.path
            return entry
        }
        
        
        let libraryMeta = LibraryMetadata(code:    libraryMetaInfo.code,
                                          entries: libraryIndexInfo,
                                          home:    libraryMetaInfo.home,
                                          name:    libraryMetaInfo.name,
                                          slug:    libraryMetaInfo.slug)
        
        return libraryMeta
    }
    
    private static func readLibraryMetaFile(atPath metaFilePath: URL) throws -> Metadata {
        let fm = FileManager.default
        
        guard let metaFileContents = fm.contents(atPath: metaFilePath.path) else {
            throw Errors.FileNotFound(path: metaFilePath.path)
        }
        
        let decoder = JSONDecoder()
        
        return try decoder.decode(Metadata.self, from: metaFileContents)
    }
    
    
    private static func readLibraryIndexFile(atPath indexFilePath: URL) throws -> [LibraryEntry] {
        let fm = FileManager.default
        
        guard let indexFileData = fm.contents(atPath: indexFilePath.path) else {
            throw Errors.FileNotFound(path: indexFilePath.path)
        }
        
        let decoder = JSONDecoder()
        let indexFile = try decoder.decode(Index.self, from: indexFileData)
        
        return indexFile.entries
    }
    
    private struct Metadata: Decodable {
        var name: String
        var slug: String
        var code: URL
        var home: URL
        
        private enum RootKeys: String, CodingKey {
            case name
            case slug
            case links
        }
        
        private enum LinksKeys: String, CodingKey {
            case code
            case home
        }
        
        init(from decoder: Decoder) throws {
            let rootContainer = try decoder.container(keyedBy: RootKeys.self)
            
            name = try rootContainer.decode(String.self, forKey: .name)
            slug = try rootContainer.decode(String.self, forKey: .slug)
            
            let linksContainer = try rootContainer.nestedContainer(keyedBy: LinksKeys.self, forKey: .links)
            
            code = try linksContainer.decode(URL.self, forKey: .code)
            home = try linksContainer.decode(URL.self, forKey: .home)
            
        }
    }
    
    private struct Index: Decodable {
        var entries: [LibraryEntry]
    }
}
