// Create by Stefan Romanescu on 03/02/2020 
// Using Swift 5.0

import Foundation
import RedditDataCollector
import RedditDataCollector_CLI

guard CommandLine.arguments.count == 3 else {
    print("""
    RedditDataCollector "/path/to/input.json" "/path/to/output/rdf.ttl"
    -------------------------------
    You must pass the path for the output turtle file.
    """)
    exit(0)
}

let inputFilePath = CommandLine.arguments[1]
let outputTurtleFilePath = CommandLine.arguments[2]
let headers = """
@prefix : <http://www.semanticweb.org/wade/ontologies/sato#> .
@prefix wd: <http://www.wikidata.org/entity/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@base <http://www.semanticweb.org/wade/ontologies/sato> .\n\n
"""


