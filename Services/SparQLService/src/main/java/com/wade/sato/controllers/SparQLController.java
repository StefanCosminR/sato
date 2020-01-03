package com.wade.sato.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stardog.stark.query.SelectQueryResult;
import com.stardog.stark.query.io.QueryResultFormats;
import com.stardog.stark.query.io.QueryResultWriters;
import com.wade.sato.adapters.StardogAdapter;
import com.wade.sato.constants.StardogConfigConstants;
import com.wade.sato.models.sparql.SparQLQuery;
import com.wade.sato.models.sparql.SparQLQueryResult;
import com.wade.sato.models.stardog.StardogConfig;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Log4j2
@RestController
@RequestMapping("/sparql")
public class SparQLController {
  private ObjectMapper objectMapper;
  private StardogAdapter adapter;

  public SparQLController() throws IOException {
    this.objectMapper = new ObjectMapper();
    StardogConfig config = objectMapper.readValue(StardogConfigConstants.CONFIG_FILE, StardogConfig.class);
    this.adapter = new StardogAdapter(config.getStorageUrl(),
                                      config.getStorageUsername(),
                                      config.getStoragePassword(),
                                      config.getDatabase());
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity<String> helloWorld() {
    return new ResponseEntity<>("Hello world", HttpStatus.OK);
  }

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity<SparQLQueryResult> query(final @RequestBody SparQLQuery query) {
    try {
      SelectQueryResult result = adapter.query(query.getQuery());
      return new ResponseEntity<>(transformStardogSelectResult(result), HttpStatus.OK);
    } catch (IOException e) {
      log.error("Could not retrieve query result: {}", e.getMessage());
      return new ResponseEntity<>(new SparQLQueryResult(), HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  private SparQLQueryResult transformStardogSelectResult(final SelectQueryResult result) throws IOException {
    ByteArrayOutputStream resultStream = new ByteArrayOutputStream();
    QueryResultWriters.write(result, resultStream, QueryResultFormats.JSON);
    return objectMapper.readValue(new ByteArrayInputStream(resultStream.toByteArray()), SparQLQueryResult.class);
  }
}
