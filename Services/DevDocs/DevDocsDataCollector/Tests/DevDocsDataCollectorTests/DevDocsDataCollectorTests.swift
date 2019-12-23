import XCTest
@testable import DevDocsDataCollector

final class DevDocsDataCollectorTests: XCTestCase {
    
    func testCreateLibraryMetadata() {
        XCTAssertNoThrow(try {
            let libraryPath = "/Users/stefancosmin/Faculty/wade/sato-extras/DevDocsRepo/public/docs/angular"
            let libraryMetadata = try LibraryMetadata.readLibrary(atPath: libraryPath)
            XCTAssertEqual(libraryMetadata.name, "Angular")
            XCTAssertEqual(libraryMetadata.slug, "angular")
            XCTAssertEqual(libraryMetadata.home.absoluteString, "https://angular.io/")
            XCTAssertEqual(libraryMetadata.code?.absoluteString, "https://github.com/angular/angular")
            XCTAssertEqual(libraryMetadata.entries.count, 669)

        }())
    }

    func testLoadAllLibraries() {
        XCTAssertNoThrow(
            try {
                let libraries = try Library.getLibraries(atPath: "/Users/stefancosmin/Faculty/wade/sato-extras/DevDocsRepo/public/docs")

                print(libraries.count)
            }()
        )
    }


}
