// Create by Stefan Romanescu on 27/12/2019 
// Using Swift 5.0

import Foundation
#if os(Linux)
import FoundationNetworking
#endif


struct TextRazorAPI {
    static func analyze(post: RedditPost, onCompletion: @escaping (Error?) -> ()) {
        guard let url = URL(string: "https://api.textrazor.com/") else {
            fatalError("Wrong url")
        }
        
        var request = URLRequest(url: url)
        
        
        let requestBodyRaw: [String: String] = ["url": post.url.absoluteString, "extractors": "topics"]
        let requestBody = encodeForURL(requestBodyRaw)
                
        request.httpMethod = "POST"
        request.httpBody = requestBody.data(using: .utf8)!
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("f056fd46da5e18f838ea0366e51617866429c89b9c395dcabbf0b61e", forHTTPHeaderField: "x-textrazor-key")
        
        
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
                    
                    if chosenTopics < 15 {
                        return true
                    }
                    
                    return false
                }
                
                for topic in response.response.topics {
                    if !shouldChooseTopic(topic) {
                        break
                    }
                    
                    chosenTopics += 1
                    let wikiLink = topic.wikiLink != "None" ? topic.wikiLink : nil
                    let wikidataId = topic.wikidataId != "None" ? topic.wikidataId : nil
                    post.tags.append(.init(name: topic.label, extraLink: wikiLink, wikidataId: wikidataId))
                }
                
                onCompletion(nil)
            } catch {
                print(String(data: data, encoding: .utf8) as Any)
                onCompletion(error)
            }
            
        }.resume()
    }
    
    private static func encodeForURL(_ body: [String: String]) -> String {
        var stringified = ""
        
        for (key, value) in body {
            let escapedBody = value.addingPercentEncoding(withAllowedCharacters: .urlUserAllowed)!
                .replacingOccurrences(of: "=", with: "%3D")
            stringified += "\(key)=\(escapedBody)&"
        }
        
        stringified.removeLast()
        
        return stringified
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
        let wikidataId: String?
    }
}
