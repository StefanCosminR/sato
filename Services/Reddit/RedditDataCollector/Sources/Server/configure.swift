import Vapor

// Called before your application initializes.
public func configure(_ app: Application) throws {
    app.server.configuration.hostname = "0.0.0.0"
    app.server.configuration.port = 80
    try routes(app)
}
