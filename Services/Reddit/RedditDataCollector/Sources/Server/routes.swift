import Vapor

func routes(_ app: Application) throws {
    
    app.get { req in
        return "It works!"
    }
    
    let controller = MainController()
    
    app.post("refresh-data", use: controller.collectAndPopulateData(req:))
    
//    app.get("hello") { req in
//        return "Hello, world!"
//    }
//
//    let todoController = TodoController()
//    app.get("todos", use: todoController.index)
//    app.post("todos", use: todoController.create)
//    app.on(.DELETE, "todos", ":todoID", use: todoController.delete)
}
