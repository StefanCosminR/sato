//
//  RedditPost.swift
//  
//
//  Created by Stefan Romanescu on 01/12/2019.
//

import Foundation


struct RedditPost: Codable {
    var domain: String
    var fullLink: URL
    var score: Int
    var subreddit: String
    var title: String
    var totalAwardsReceived: Int
}

extension RedditPost {
    
    private enum CodingKeys: String, CodingKey{
        case domain
        case fullLink = "full_link"
        case score
        case subreddit
        case title
        case totalAwardsReceived = "total_awards_received"
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        let tempLink = (try? container.decode(String.self, forKey: .fullLink))!.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
        
        domain = try container.decode(String.self, forKey: .domain)
        fullLink =se URL(string: tempLink)!
        score = try container.decode(Int.self, forKey: .score)
        subreddit = try container.decode(String.self, forKey: .subreddit)
        title = try container.decode(String.self, forKey: .title)
        totalAwardsReceived = try container.decode(Int.self, forKey: .totalAwardsReceived)
    }
}
