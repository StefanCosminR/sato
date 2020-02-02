// Create by Stefan Romanescu on 01/12/2019
// Using Swift 5.0

import Foundation

public final class RedditPost: Codable {
    public private(set) var domain: String
    public private(set) var fullLink: URL
    public private(set) var score: Int
    public private(set) var subreddit: String
    public private(set) var title: String
    public private(set) var totalAwardsReceived: Int
    public private(set) var url: URL
    public private(set) var retrievedOn: Int
    public var tags: [Tag] = []
    
    private enum CodingKeys: String, CodingKey{
        case domain
        case fullLink = "full_link"
        case score
        case subreddit
        case title
        case totalAwardsReceived = "total_awards_received"
        case url
        case retrievedOn = "retrieved_on"
    }
    
    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        let tempLink = (try? container.decode(String.self, forKey: .fullLink))!
            .addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
        
        domain = try container.decode(String.self, forKey: .domain)
        fullLink = URL(string: tempLink)!
        score = try container.decode(Int.self, forKey: .score)
        subreddit = try container.decode(String.self, forKey: .subreddit)
        title = try container.decode(String.self, forKey: .title)
        totalAwardsReceived = try container.decode(Int.self, forKey: .totalAwardsReceived)
        url = URL(string: try container.decode(String.self, forKey: .url))!
        retrievedOn = try container.decode(Int.self, forKey: .retrievedOn)
    }
    
    public struct Tag {
        public let name: String
        public let extraLink: String?
        public let wikidataId: String?
    }
}
