// Create by Stefan Romanescu on 04/12/2019 
// Using Swift 5.0

import Foundation

guard CommandLine.arguments.count > 1 else {
    print("""
    DevDocsDataCollector
    -------------------------------
    Pass the input to the DevDocs cloned repository
    and the path where the parsed output should be written to
    """)
    exit(0)
}
