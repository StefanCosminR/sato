import Vapor

// Called before your application initializes.
func configure(_ app: Application) throws {
    guard let _ = Config.devDocsFolder else {
        fatalError("Should set 'devDocsFolder' environment variable")
    }
    try routes(app)
}
