// swift-tools-version:5.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "DevDocsDataCollector",
    platforms: [
        .macOS(.v10_14)
    ],
    products: [
        // Products define the executables and libraries produced by a package, and make them visible to other packages.
        .library(
            name: "DevDocsDataCollector",
            targets: ["DevDocsDataCollector"]),
        .executable(name: "DevDocsDataCollector-CLI", targets: ["DevDocsDataCollector-CLI"]),
        .executable(name: "RunServer", targets: ["RunServer"]),
        .library(name: "Server", targets: ["Server"]),
    ],
    dependencies: [
        // Dependencies declare other packages that this package depends on.
        // .package(url: /* package url */, from: "1.0.0"),
        .package(url: "https://github.com/vapor/vapor.git", from: "4.0.0-beta.3")
    ],
    targets: [
        // Targets are the basic building blocks of a package. A target can define a module or a test suite.
        // Targets can depend on other targets in this package, and on products in packages which this package depends on.
        .target(
            name: "DevDocsDataCollector",
            dependencies: []),
        .target(
            name: "DevDocsDataCollector-CLI",
            dependencies: ["DevDocsDataCollector"]),
        .testTarget(
            name: "DevDocsDataCollectorTests",
            dependencies: ["DevDocsDataCollector"]),
        .target(
            name: "Server",
            dependencies: ["DevDocsDataCollector", "Vapor", "DevDocsDataCollector-CLI"]),
        .target(
            name: "RunServer",
            dependencies: ["Server"])
        
    ]
)
