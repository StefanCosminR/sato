## Welcome to SATO project 

## Description
Information about software development is readily available on the web today, unfortunately it is mostly simply data, _*understandable by humans in the right context but very hard to aggregate and search by computers*_. 

SATO makes a step forward in this direction and comes up with a solution to unite big software development resources (such as GitHub, MDN, DevDocs etc.) under one mashup API adding semantics to data by making them available in the RDF format.

## Project progress
- 01 Oct 2019 - Project Start. Design and Documentation Phase
- 19 Oct 2019 - Started collecting information about multiple technologies that could be of interest for the project. Researched technologies: 
  - Github Pages
  - APIs (Github, Reddit, MDN, Programmable Web etc.) 
  - RDF 
  - SPARQL 
  - Apache Jena
  - Apache Fuseki
  - Docker support for project purposes
  - Rest APIs.
- 02 Nov 2019 - Design of application architecture. Making risk analysis, high level view of application workflows.
- 09 Nov 2019 - Break down of application main module, tasks. Design of UML diagrams.
- 16 Nov 2019 - Open API specifications for SATO REST API.
- 23 Nov 2019 - Scholarly HTML.
- 25 Nov 2019 - Final polishing over the Design and Documentation.
- 30 Nov 2019 - Reasearch started for ways of collecting resources from DevDocs
- 01 Dec 2019 - Collecting topics from GitHub
- 08 Dec 2019 - Finished SATO Ontology
- 22 Dec 2019 - Finished DevDocsService and started work for collecting Reddit data
- 29 Dec 2019 - Finished RedditService and TextRazor integration
- 30 Dec 2019 - Finished GithubService collection, started export to Stardog
- 31 Dec 2019 - Started work for UserInterface
- 02 Ian 2020 - Finished integation of GitgubService with Stardog
- 03 Ian 2020 - Created SparQLEndpoint service
- 05 Ian 2020 - Integrating OAuth in UserInteface
- 20 Ian 2020 - Added recomandation based on interests for authenticated users in UserInterface
- 28 Ian 2020 - Finished all services, started deployment


Below you can find a minimal project presentation. You can check the full application documentation by reading the Scholarly HTML documentation that can be found in the "scholarly/scholarly.html" file in this repository.

## General Architecture
![alt text](https://github.com/StefanCosminR/sato/raw/master/scholarly/WADE/SATO-Architecture.png)
The SATO service promotes an architecture based on micro-services so that it can scale well and be available 99% of the time. Being a micro-service based application, SATO has multiple loosely coupled and high cohesive components:

1. Multiple servers that expose the SATO API
2. SATO servers Load Balancer
3. Data Source Services
4. Data Source SPARQL Databases
5. Users Service
6. Data Refresher Service/Job
7. User Interface Server
8. Content Distribution Network
9. Client Application

## Modules Architecture
![alt text](https://github.com/StefanCosminR/sato/raw/master/scholarly/WADE/SATO-Main-Modules.png)
The application is composed from multiple reusable modules that are common between some application components. The most notable and important modules which are detailed in the following subsections are:

1. Data Source Adapters Module
2. Data Transformation Module
3. Data Persistence Module
4. Models Module


## Main Service Tasks
#### Query for specific topics
![alt text](https://github.com/StefanCosminR/sato/raw/master/scholarly/WADE/QueryForTopics.png)

#### Refresh RDF Data
![alt text](https://github.com/StefanCosminR/sato/raw/master/scholarly/WADE/DataRefreshFlow.png)
