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
public class Repository {
  private int id;
  private User owner;
  private String name;
  private boolean isFork;
  private String html_url;
  private String fullName;
  private boolean isPrivate;
  private String Description;
  private String languages_url;
  private String contributors_url;
}
