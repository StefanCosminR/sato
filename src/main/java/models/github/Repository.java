package models.github;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Repository {
  private int id;

  private User owner;

  private String name;

  @JsonProperty("fork")
  private boolean isFork;

  @JsonProperty("html_url")
  private String htmlUrl;

  @JsonProperty("full_name")
  private String fullName;

  @JsonProperty("private")
  private boolean isPrivate;

  private String description;

  @JsonProperty("languages_url")
  private String languagesUrl;

  @JsonProperty("contributors_url")
  private String contributorsUrl;
}
