package models.github;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
  private String repos_url;
  private boolean site_admin;
  private String followers_url;
  private String following_url;
}
