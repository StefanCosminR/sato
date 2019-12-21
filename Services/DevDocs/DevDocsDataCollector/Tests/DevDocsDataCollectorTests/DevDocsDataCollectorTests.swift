import XCTest
@testable import DevDocsDataCollector

final class DevDocsDataCollectorTests: XCTestCase {
    
    func testCreateLibraryMetadata() {
        XCTAssertNoThrow(try {
            let libraryPath = "/Users/stefancosmin/Faculty/wade/sato/Services/DevDocs/DevDocsRepo/public/docs/angular"
            let libraryMetadata = try LibraryMetadata.readLibrary(atPath: libraryPath)
            XCTAssertEqual(libraryMetadata.name, "Angular")
            XCTAssertEqual(libraryMetadata.slug, "angular")
            XCTAssertEqual(libraryMetadata.home.absoluteString, "https://angular.io/")
            XCTAssertEqual(libraryMetadata.code.absoluteString, "https://github.com/angular/angular")
            XCTAssertEqual(libraryMetadata.entries.count, 669)
            
        }())
    }
 
    func testLoadAllLibraries() {
        XCTAssertNoThrow(
            try {
                let libraries = try Library.getLibraries(atPath: "/Users/stefancosmin/Faculty/wade/sato/Services/DevDocs/DevDocsRepo/public/docs")
                
                print(libraries.count)
            }()
        )
    }
    
    func bench() {
        var someDict = [String: [String]]()
        
        for i in 0..<1000000 {
            someDict["\(i)"] = ["\(i + 2) ane au \(i - 2) mere"]
        }
        
        measure {
            for i in 0..<1100000 {
                var oldStr = someDict["\(i)"] ?? []
                oldStr.append("am gresit")
                someDict["\(i)"] = oldStr
            }
        }
        
        
    }
    
    func benchFaster() {
        var someDict = [String: [String]]()
        
        for i in 0..<1000000 {
            someDict["\(i)"] = ["\(i + 2) ane au \(i - 2) mere"]
        }
        
        measure {
            for i in 0..<1100000 {
                var oldStr = someDict["\(i)"] ?? []
                someDict.removeValue(forKey: "\(i)")
                oldStr.append("am gresit")
                someDict["\(i)"] = oldStr
            }
        }
        
    }


}
