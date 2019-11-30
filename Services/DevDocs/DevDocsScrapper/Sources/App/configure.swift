import Vapor

// Called before your application initializes.
func configure(_ app: Application) throws {

    // Register middleware
    app.register(extension: MiddlewareConfiguration.self) { middlewares, app in
        // Serves files from `Public/` directory
        // middlewares.use(app.make(FileMiddleware.self))
    }
    
    try routes(app)
}
