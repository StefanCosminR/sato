// Create by Stefan Romanescu on 27/12/2019 
// Using Swift 5.0

import Foundation
#if os(Linux)
import FoundationNetworking
#endif

struct MonkeyLearnAPI {
    static func extractKeywords(fromTexts texts: [String],
                                onCompletion: @escaping (Result<[[String]], Error>) -> ()) {
        
        guard let url = URL(string: "http://localhost:8080") else {
            fatalError("Wrong url")
        }
        
        var request = URLRequest(url: url)
        
        do {
            let requestBody = getRequestBody(forText: texts)
            let data = try JSONSerialization.data(withJSONObject: requestBody, options: [])
        
            request.httpMethod = "POST"
            request.httpBody = data
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("Token XXXXXXX", forHTTPHeaderField: "Authorization")
        } catch {
            onCompletion(.failure(error))
            return
        }

        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error {
                onCompletion(.failure(error))
            }
            
            guard let data = data else {
                onCompletion(.failure(MonkeyLearnAPIError.noResponse))
                return
            }
            
            do {
                let decoder = JSONDecoder()
                let response = try decoder.decode([ExtractorResponse].self, from: data)
                
                let keywords = response.map { (extractor: ExtractorResponse) -> [String] in
                    return extractor.extractions.map { extraction in extraction.parsedValue }
                }
                
                onCompletion(.success(keywords))
            } catch {
                onCompletion(.failure(error))
            }
           
        }.resume()
        
    }
    
    static private func getRequestBody(forText someText: [String]) -> [String: Any] {
        var response: [String: Any] = [:]
        
        response["data"] = someText
        return response
    }
    
    private init() {}
}

enum MonkeyLearnAPIError: Error {
    case noResponse
    case couldNotDecodeResponse
}

fileprivate struct ExtractorResponse {
    let text: String
    let extractions: [Extraction]
    
    fileprivate struct Extraction {
        var parsedValue: String
    }
}

extension ExtractorResponse.Extraction: Decodable {
    
    private enum CodingKeys: String, CodingKey {
        case parsedValue = "parsed_value"
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        parsedValue = try container.decode(String.self, forKey: .parsedValue)
    }
}

extension ExtractorResponse: Decodable {
    
    private enum CodingKeys: String, CodingKey {
        case text
        case extractions
    }
    
    init(from decoder: Decoder) throws {
        let rootContainer = try decoder.container(keyedBy: CodingKeys.self)
        
        text = try rootContainer.decode(String.self, forKey: .text)
        extractions = try rootContainer.decode([Extraction].self, forKey: .extractions)
    }
}
