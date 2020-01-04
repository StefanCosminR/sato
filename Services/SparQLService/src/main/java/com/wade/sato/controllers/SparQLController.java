package com.wade.sato.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wade.sato.constants.StardogConfigConstants;
import com.wade.sato.models.sparql.SparQLQuery;
import com.wade.sato.models.stardog.StardogConfig;
import lombok.extern.log4j.Log4j2;
import org.apache.curator.shaded.com.google.common.net.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;

@Log4j2
@RestController
@RequestMapping("/sparql")
public class SparQLController {
  private String queryLocation;

  public SparQLController() throws IOException {
    StardogConfig config = new ObjectMapper().readValue(StardogConfigConstants.CONFIG_FILE, StardogConfig.class);
    this.queryLocation = String.format("%s/%s/query", config.getStorageUrl(), config.getDatabase());
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity<String> helloWorld() {
    return new ResponseEntity<>("Hello world", HttpStatus.OK);
  }

  @RequestMapping(method = RequestMethod.POST)
  @CrossOrigin
  public ResponseEntity<String> query(final HttpServletRequest request, final @RequestBody SparQLQuery query) {
    Client client = ClientBuilder.newClient();
    Entity<Form> payload = Entity.form(new Form().param("query", query.getQuery()));

    Response response = client.target(queryLocation)
        .request(MediaType.TEXT_PLAIN_TYPE)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED)
        .header(HttpHeaders.ACCEPT, request.getHeader(HttpHeaders.ACCEPT))
        .header(HttpHeaders.AUTHORIZATION, "Basic YWRtaW46YWRtaW4=")
        .header(HttpHeaders.CACHE_CONTROL, "no-cache")
        .post(payload);

    HttpStatus status = Optional
        .of(HttpStatus.valueOf(response.getStatus()))
        .orElse(HttpStatus.SERVICE_UNAVAILABLE);

    return new ResponseEntity<>(response.readEntity(String.class), status);
  }
}
