import XCTest
@testable import RedditDataCollector

final class RedditDataCollectorTests: XCTestCase {
    func testGettingRedditPosts() {
        let expectation = XCTestExpectation(description: #"Download post from subreddit "programming""#)
        
        
        let api = RedditAPI()
        
        api.getPosts(for: .programming) { result in
            switch result {
            case .success(let redditPosts):
                print("success")
            case .failure(let error):
                print("Error: \(error)")
                return
            }
            
//            dump(posts)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 15)
    }
    
    func testTime() {
        print("\n\n\n\n")
        
        print(String(getTimeInterval(daysPrior: 7).begin))
        print("\n\n\n\n")

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
