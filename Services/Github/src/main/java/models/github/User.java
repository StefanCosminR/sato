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
public class User {
  private int id;

  private String url;

  private String type;

  private String login;

  @JsonProperty("repos_url")
  private String reposUrl;

  @JsonProperty("html_url")
  private String profileUrl;

  @JsonProperty("site_admin")
  private boolean isSiteAdmin;

  @JsonProperty("followers_url")
  private String followersUrl;

  @JsonProperty("following_url")
  private String followingUrl;
}
