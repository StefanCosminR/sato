// Create by Stefan Romanescu on 01/12/2019
// Using Swift 5.0

import Foundation

struct RedditAPI {
    
    func constructURL(queryParams: [URLQueryItem]) -> URL {
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
    
    func getPosts(for subreddit: Subreddit,
                  onCompletion:  @escaping (_ result: Result<[RedditPost], Error>) -> ()) {
        let timeInterval = getTimeInterval(daysPrior: 7)
        
        let queryParams = [
            URLQueryItem(name: "subreddit", value: subreddit.rawValue),
            URLQueryItem(name: "sort", value: "desc"),
            URLQueryItem(name: "sort_type", value: "score"),
            URLQueryItem(name: "after", value: String(timeInterval.begin)),
            URLQueryItem(name: "before", value: String(timeInterval.end)),
            URLQueryItem(name: "size", value: "1000")
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
                onCompletion(.success(redditPosts.data))
            } catch {
                onCompletion(.failure(error))
            }
            
        }
        
        task.resume()
    }
    
    private func getTimeInterval(daysPrior: UInt) -> (begin: Int, end: Int) {
        var dateComponents = DateComponents()
        dateComponents.setValue(-Int(daysPrior), for: .day) // minus "daysPrior" days
        
        let now = Date()
        let someTimeInThePast = Calendar.current.date(byAdding: dateComponents, to: now)!
        
        return (begin: Int(someTimeInThePast.timeIntervalSince1970), end: Int(now.timeIntervalSince1970))
    }
}


fileprivate struct ApiResult: Codable {
    let data: [RedditPost]
}
