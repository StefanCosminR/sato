// Create by Stefan Romanescu on 27/12/2019 
// Using Swift 5.0

import Foundation


struct TextRazorAPI {
    static func analyze(post: RedditPost, onCompletion: @escaping (Error?) -> ()) {
        guard let url = URL(string: "https://api.textrazor.com/") else {
            fatalError("Wrong url")
        }
        
        var request = URLRequest(url: url)
        
        
        let requestBodyRaw: [String: Any] = ["url": post.url, "extractors": "topics"]
        let requestBody = encodeForURL(requestBodyRaw)
        
        request.httpMethod = "POST"
        request.httpBody = requestBody.data(using: .utf8)!
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("xxxxxx", forHTTPHeaderField: "x-textrazor-key")
        
        
        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error {
                onCompletion(error)
            }
            
            guard let data = data else {
                onCompletion(Errors.noResponse)
                return
            }
            
            do {
                let decoder = JSONDecoder()
                let response = try decoder.decode(TextRazorAPIResponse.self, from: data)
                
                // MARK: Choosing which tags to keep
                var chosenTopics = 0
                
                func shouldChooseTopic(_ topic: TextRazorAPIResponse.Topic) -> Bool {
                    if topic.score > 0.97 {
                        return true
                    }
                    
                    if topic.score < 0.8 {
                        return false
                    }
                    
                    if chosenTopics < 10 {
                        return true
                    }
                    
                    return false
                }
                
                for topic in response.response.topics {
                    if !shouldChooseTopic(topic) {
                        break
                    }
                    
                    chosenTopics += 1
                    
                    post.tags.append(RedditPost.Tag(name: topic.label, extraLink: topic.wikiLink))
                }
                
                onCompletion(nil)
            } catch {
                onCompletion(error)
            }
            
        }.resume()
    }
    
    private static func encodeForURL(_ body: [String: Any]) -> String {
        var stringified = body.reduce("") { (carry, keyValue) in "\(carry)\(keyValue.0)=\(keyValue.1)&" }
        stringified.removeLast()
        
        return stringified.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
    }
    
    
    enum Errors: Error {
        case noResponse
    }
    
    
}

fileprivate struct TextRazorAPIResponse: Decodable {
    let response: Response
    
    fileprivate struct Response: Decodable {
        let topics: [Topic]
    }
    
    fileprivate struct Topic: Decodable {
        let label: String
        let score: Double
        let wikiLink: String
    }
}
