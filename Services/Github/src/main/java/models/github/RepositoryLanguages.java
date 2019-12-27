package models.github;

import java.util.HashMap;
import java.util.Set;

public class RepositoryLanguages extends HashMap<String, Integer> {
  public Set<String> getLanguages() {
    return this.keySet();
  }

  public Integer getBytesOfCode(final String language) {
    return this.get(language);
  }
}
