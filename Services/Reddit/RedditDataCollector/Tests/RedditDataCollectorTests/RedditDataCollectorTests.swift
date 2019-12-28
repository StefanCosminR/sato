import XCTest
@testable import RedditDataCollector

final class RedditDataCollectorTests: XCTestCase {
    func testGettingRedditPosts() {
        let expectation = XCTestExpectation(description: #"Download post from subreddit "programming""#)
        
        RedditAPI.getPosts(for: .programming) { result in
            switch result {
            case .success(let redditPosts):
                print("success")
                dump(redditPosts)
            case .failure(let error):
                print("Error: \(error)")
                return
            }
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 15)
    }
    
    func testMonkeyLearnAPI() {
        let expectation = XCTestExpectation(description: "Extract keywords from text")
        
        MonkeyLearnAPI.extractKeywords(fromTexts: ["Some text"]) { result in
            switch result {
            case .success(let keywords):
                print("it worked")
                dump(keywords)
            case .failure(let error):
                print("Got Error: \(error)")
            }
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 15)
    }
    
    func testTime() {
        print("\n\n\n\n")
        
        print(String(getTimeInterval(daysPrior: 7).begin))
        print("\n\n\n\n")

    }
    
    func testArrayGroup() {
        let demo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        let groups = demo.createGroup(of: 9)
        
        XCTAssert(groups[0] == demo[0...8])
        XCTAssert(groups[1] == demo[9...])
    }
    
    func testURLEncodeDictionary() {
        let body: [String: Any] = ["someKey": "someValue", "anotherKey": 2, "url": "nu conteaza ce e aici"]
        var stringified = body.reduce("") { (carry, keyValue) in "\(carry)\(keyValue.0)=\(keyValue.1)&" }

        stringified.removeLast()
        let encodedBody = stringified.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
        
        print(encodedBody)
    }
    
    private func getTimeInterval(daysPrior: UInt) -> (begin: Int, end: Int) {
        var dateComponents = DateComponents()
        dateComponents.setValue(-Int(daysPrior), for: .day) // minus "daysPrior" days
        
        let now = Date()
        let someTimeInThePast = Calendar.current.date(byAdding: dateComponents, to: now)!
        
        return (begin: Int(someTimeInThePast.timeIntervalSince1970), end: Int(now.timeIntervalSince1970))
    }

    static var allTests = [
        ("testExample", testGettingRedditPosts),
    ]
}
