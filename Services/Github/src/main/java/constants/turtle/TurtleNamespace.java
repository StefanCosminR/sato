package constants.turtle;

import lombok.Getter;

@Getter
public enum TurtleNamespace {
  SATO("http://www.semanticweb.org/wade/ontologies/sato#"),
  RDF("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
  RDFS("http://www.w3.org/2000/01/rdf-schema#"),
  XML("http://www.w3.org/XML/1998/namespace#"),
  XSD("http://www.w3.org/2001/XMLSchema#"),
  OWL("http://www.w3.org/2002/07/owl#");

  private String url;

  TurtleNamespace(String url) {
    this.url = url;
  }
}
