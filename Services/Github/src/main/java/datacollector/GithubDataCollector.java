package datacollector;

import adapters.GithubAdapter;
import lombok.AllArgsConstructor;
import models.datacollector.GithubDataCollectorInput;
import models.datacollector.GithubDataCollectorOutput;
import models.github.Repository;
import models.github.RepositoryDataCollection;
import utils.ThreadUtils;

@AllArgsConstructor
public class GithubDataCollector {
  private GithubAdapter adapter;

  public GithubDataCollectorOutput collect(final GithubDataCollectorInput input) {
    GithubDataCollectorOutput result = new GithubDataCollectorOutput();
    adapter.searchRepositoryByTopic(input.getTopic(), input.getPage(), input.getPageSize())
        .getItems()
        .forEach(repository -> {
      result.put(repository.getId(), collectRepositoryData(repository));
      if (input.isVerbose()) {
        System.out.println(String.format("Processed %d. %s/%s",
                           repository.getId(),
                           repository.getOwner().getLogin(),
                           repository.getName()));
      }
      ThreadUtils.sleep(input.getMillisBetweenDataCollection());
    });
    return result;
  }

  private RepositoryDataCollection collectRepositoryData(final Repository repository) {
    Repository fullRepoInfo = adapter.getRepositoryInfo(repository.getOwner().getLogin(), repository.getName());
    return RepositoryDataCollection.builder()
        .contributors(adapter.getContributors(fullRepoInfo))
        .topics(adapter.getRepositoryTopics(fullRepoInfo))
        .languages(adapter.getLanguages(fullRepoInfo))
        .generalData(fullRepoInfo)
        .build();
  }
}
