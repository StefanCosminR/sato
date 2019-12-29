package models.datacollector;

import models.github.RepositoryDataCollection;

import java.util.HashMap;
import java.util.Set;

public class GithubDataCollectorOutput extends HashMap<Integer, RepositoryDataCollection> {
  public Set<Integer> getRepositoryIds() {
    return this.keySet();
  }

  public RepositoryDataCollection getRepositoryData(final int id) {
    return this.get(id);
  }
}
