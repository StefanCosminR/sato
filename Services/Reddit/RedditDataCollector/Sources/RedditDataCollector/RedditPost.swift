// Create by Stefan Romanescu on 01/12/2019
// Using Swift 5.0

import Foundation

final class RedditPost: Codable {
    private(set) var domain: String
    private(set) var fullLink: URL
    private(set) var score: Int
    private(set) var subreddit: String
    private(set) var title: String
    private(set) var totalAwardsReceived: Int
    var tags: [String] = []
    
    private enum CodingKeys: String, CodingKey{
        case domain
        case fullLink = "full_link"
        case score
        case subreddit
        case title
        case totalAwardsReceived = "total_awards_received"
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        let tempLink = (try? container.decode(String.self, forKey: .fullLink))!
            .addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
        
        domain = try container.decode(String.self, forKey: .domain)
        fullLink = URL(string: tempLink)!
        score = try container.decode(Int.self, forKey: .score)
        subreddit = try container.decode(String.self, forKey: .subreddit)
        title = try container.decode(String.self, forKey: .title)
        totalAwardsReceived = try container.decode(Int.self, forKey: .totalAwardsReceived)
    }
}
