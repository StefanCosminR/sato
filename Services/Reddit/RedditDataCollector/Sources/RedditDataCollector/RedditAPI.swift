// Create by Stefan Romanescu on 01/12/2019
// Using Swift 5.0

import Foundation

public struct RedditAPI {
    
    static public func getPosts(for subreddit: Subreddit,
                         onCompletion:  @escaping (_ result: Result<[RedditPost], Error>) -> ()) {
        let timeInterval = getTimeInterval(daysPrior: 7)
        
        let queryParams = [
            URLQueryItem(name: "subreddit", value: subreddit.rawValue),
            URLQueryItem(name: "sort", value: "desc"),
            URLQueryItem(name: "sort_type", value: "score"),
            URLQueryItem(name: "after", value: String(timeInterval.begin)),
            URLQueryItem(name: "before", value: String(timeInterval.end)),
            URLQueryItem(name: "size", value: "100")
        ]
        
        let redditURL = constructURL(queryParams: queryParams)
        
        let task = URLSession.shared.dataTask(with: redditURL) { data, urlResponse, error in
            if let error = error {
                onCompletion(.failure(error))
                return
            }
            
            guard let data = data else {
                onCompletion(.success([]))
                return
            }
            
            let decoder = JSONDecoder()
            
            do {
                let redditPosts = try decoder.decode(ApiResult.self, from: data)
                populateTags(for: redditPosts.data, onCompletion: onCompletion)
            } catch {
                onCompletion(.failure(error))
            }
            
        }
        
        task.resume()
    }
    
    static func populateTags(for posts: [RedditPost],
                             onCompletion: @escaping (_ result: Result<[RedditPost], Error>) -> ()) {
        
        
        func populate(_ index: Int = 0) {
            if index == posts.count {
                onCompletion(.success(posts))
                return
            }
            
            TextRazorAPI.analyze(post: posts[index]) { err in
                if err != nil {
                    print("\n-----------------------------------")
                    debugPrint("Failed to get tags, \(err!)")
                    dump(posts[index])
                    print("-----------------------------------\n\n")
//                    onCompletion(.failure(err!))
                }
                
                populate(index + 1)
            }
        }
        
        populate()
        
    }
    
    static func constructURL(queryParams: [URLQueryItem]) -> URL {
        var redditURL = URLComponents()
        redditURL.scheme = "https"
        redditURL.host   = "api.pushshift.io"
        redditURL.path   = "/reddit/search/submission/"
        redditURL.queryItems = queryParams
        
        guard let validURL = redditURL.url else {
            dump(redditURL)
            fatalError("There is something wrong with the url")
        }
        
        return validURL
    }
    
    static private func getTimeInterval(daysPrior: UInt) -> (begin: Int, end: Int) {
        var dateComponents = DateComponents()
        dateComponents.setValue(-Int(daysPrior), for: .day) // minus "daysPrior" days
        
        let now = Date()
        let someTimeInThePast = Calendar.current.date(byAdding: dateComponents, to: now)!
        
        return (begin: Int(someTimeInThePast.timeIntervalSince1970), end: Int(now.timeIntervalSince1970))
    }
    
    private init() {}
}


fileprivate struct ApiResult: Codable {
    let data: [RedditPost]
}

enum RedditAPIError: String, Error {
    case cannotReceiveTags
}
