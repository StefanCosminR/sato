// swift-tools-version:5.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "RedditDataCollector",
    platforms: [
        .macOS(.v10_14)
    ],
    products: [
        .library(name: "RedditDataCollector", targets: ["RedditDataCollector"]),
        .executable(name: "RedditDataCollector-CLI", targets: ["RedditDataCollector-CLI"]),
        .executable(name: "RedditDataCollector-CLI-FileInput", targets: ["RedditDataCollector-CLI-FileInput"]),
        .executable(name: "RunServer", targets: ["RunServer"]),
        .library(name: "Server", targets: ["Server"])
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/vapor.git", from: "4.0.0-beta.2")
    ],
    targets: [
        // Targets are the basic building blocks of a package. A target can define a module or a test suite.
        // Targets can depend on other targets in this package, and on products in packages which this package depends on.
        .target(
            name: "RedditDataCollector",
            dependencies: []),
        .target(
            name: "RedditDataCollector-CLI",
            dependencies: ["RedditDataCollector"]),
        .target(
            name: "RedditDataCollector-CLI-FileInput",
            dependencies: ["RedditDataCollector", "RedditDataCollector-CLI"]),
        .testTarget(
            name: "RedditDataCollectorTests",
            dependencies: ["RedditDataCollector"]),
        .target(
            name: "Server",
            dependencies: ["RedditDataCollector", "Vapor", "RedditDataCollector-CLI"]),
        .target(
            name: "RunServer",
            dependencies: ["Server", "RedditDataCollector-CLI"])
    ]
)
