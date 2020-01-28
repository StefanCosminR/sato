import Vapor

func routes(_ app: Application) throws {
    
    let mainController = MainController();
    
    app.post("refresh", use: mainController.collectAndPopulateData(req:))
    
//    app.get { req in
//        return "It works!"
//    }
//    
//    app.get("hello") { req in
//        return "Hello, world!"
//    }
//
//    let todoController = TodoController()
//    app.get("todos", use: todoController.index)
//    app.post("todos", use: todoController.create)
//    app.on(.DELETE, "todos", ":todoID", use: todoController.delete)
}
