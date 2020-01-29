// Create by Stefan Romanescu on 05/01/2020 
// Using Swift 5.0

import Vapor

struct MainController {
    private let collectingDevDocsService = CollectingRedditService()
    
    func collectAndPopulateData(req: Request) throws -> EventLoopFuture<HTTPStatus> {
        let response = req.eventLoop.makePromise(of: HTTPStatus.self)
        
        collectingDevDocsService.collectAndSendToDB(eventLoop: req.eventLoop)
            .whenComplete { result in
                switch result {
                case .success():
                    response.succeed(.ok)
                case .failure(let error):
                    response.fail(error)
                }
        }
        
        return response.futureResult
    }
}
