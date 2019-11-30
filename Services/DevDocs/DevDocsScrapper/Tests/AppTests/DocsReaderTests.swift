//
//  DocsReaderTests.swift
//  AppTests
//
//  Created by Stefan Romanescu on 30/11/2019.
//

import XCTest
@testable import App

class DocsReaderTests: XCTestCase {
    
    func testLoadedDocsReader() throws {
        print("\n\n\n\n")
        // add your tests here
        var docsReader = DocsReader(folderPath: "/Users/stefancosmin/Faculty/wade/sato/Services/DevDocs/DevDocsRepo/public/docs")
        
        try docsReader.populateContents()
        
        
        print(docsReader)
        
        print("\n\n\n\n")
        XCTAssert(true)
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
