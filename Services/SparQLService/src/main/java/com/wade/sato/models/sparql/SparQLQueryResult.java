package com.wade.sato.models.sparql;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SparQLQueryResult {
  private Header head;
  private ResultList results;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Header {
    @JsonProperty("vars")
    private List<String> variables;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ResultList {
    private List<HashMap<String, Entry>> bindings;
  }

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class Entry {
    private String type;
    private String value;
  }
}
