// Create by Stefan Romanescu on 25/01/2020 
// Using Swift 5.0

import Server
import Vapor

var env = try Environment.detect()
try LoggingSystem.bootstrap(from: &env)
let app = Application(env)
defer { app.shutdown() }
try configure(app)
try app.run()

