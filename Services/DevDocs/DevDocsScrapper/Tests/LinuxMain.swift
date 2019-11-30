import XCTest

import AppTests

var tests = [XCTestCaseEntry]()
tests += AppTests.__allTests()
tests += DocsReaderTests.allTests
print("what are tests \(tests)")

XCTMain(tests)
