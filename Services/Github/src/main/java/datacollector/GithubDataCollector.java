package datacollector;

import adapters.GithubAdapter;
import lombok.extern.log4j.Log4j2;
import models.datacollector.GithubDataCollectorInput;
import models.datacollector.GithubDataCollectorOutput;
import models.github.Repository;
import models.github.RepositoryDataCollection;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

@Log4j2
public class GithubDataCollector {
  private static final long TIMEOUT_TIME = 10;

  private ExecutorService executor;
  private GithubAdapter adapter;

  public GithubDataCollector(final GithubAdapter adapter) {
    this.executor = Executors.newSingleThreadExecutor();
    this.adapter = adapter;
  }

  public GithubDataCollectorOutput collect(final GithubDataCollectorInput input) {
    GithubDataCollectorOutput result = new GithubDataCollectorOutput();
    adapter.searchRepositoryByTopic(input.getTopic(), input.getPage(), input.getPageSize())
        .getItems()
        .forEach(repository -> {
          try {
            Future<RepositoryDataCollection> task = executor.submit(() -> collectRepositoryData(repository));
            result.put(repository.getId(), task.get(TIMEOUT_TIME, TimeUnit.SECONDS));
            if (input.isVerbose()) {
              System.out.println(String.format("Processed %d. %s/%s",
                                 repository.getId(),
                                 repository.getOwner().getLogin(),
                                 repository.getName()));
            }
          } catch (Exception e) {
            log.error("Could not collect data for {}: {}", repository.getFullName(), e);
          }
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
