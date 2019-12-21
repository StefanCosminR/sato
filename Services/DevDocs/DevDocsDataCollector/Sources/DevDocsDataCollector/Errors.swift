// Create by Stefan Romanescu on 04/12/2019 
// Using Swift 5.0

public enum Errors: Error {
    case FileNotFound(path: String)
    case CouldNotDecode
    case CouldNotTransformToData
}
