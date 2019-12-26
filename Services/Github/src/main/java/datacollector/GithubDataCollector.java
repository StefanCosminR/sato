package datacollector;

import adapters.GithubAdapter;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import models.datacollector.GithubResult;
import models.github.Repository;
import models.github.RepositoryDataCollection;
import utils.ThreadUtils;

@Log4j2
@AllArgsConstructor
public class GithubDataCollector {
  private GithubAdapter adapter;

  public GithubResult collect(final int startAfterId, final int millisBetweenDataCollection, final boolean verbose) {
    GithubResult result = new GithubResult();
    adapter.listRepositories(startAfterId).forEach(repository -> {
      result.put(repository.getId(), collectRepositoryData(repository));
      if (verbose) {
        log.info(String.format("Processed %d. %s/%s",
                               repository.getId(),
                               repository.getOwner().getLogin(),
                               repository.getName()));
      }
      ThreadUtils.sleep(millisBetweenDataCollection);
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
