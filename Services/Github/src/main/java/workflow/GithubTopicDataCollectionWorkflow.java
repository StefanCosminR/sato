package workflow;

import adapters.GithubAdapter;
import constants.github.GithubApiConstants;
import datacollector.GithubDataCollector;
import models.datacollector.GithubDataCollectorInput;
import models.datacollector.GithubDataCollectorOutput;

import java.io.IOException;

public class GithubTopicDataCollectionWorkflow {
  private static final int MILLIS_BETWEEN_DATA_COLLECTION = 300;
  private static final int PAGE_SIZE = 50;

  private GithubDataCollector collector;

  public GithubTopicDataCollectionWorkflow() throws IOException {
    this.collector = new GithubDataCollector(new GithubAdapter());
  }

  public void start(final String topic) {
    System.out.println(String.format("Collecting repositories for topic '%s'...", topic));
    GithubDataCollectorOutput data = collectTopicData(topic);
    System.out.println(data);
    // TODO add stardog processing here
  }

  private GithubDataCollectorOutput collectTopicData(final String topic) {
    GithubDataCollectorOutput result = new GithubDataCollectorOutput();
    GithubDataCollectorOutput pageData;
    int page = 1;

    do {
      System.out.println(String.format("Processing page %d", page));
      pageData = collector.collect(getGithubDataCollectorInput(topic, page));
      System.out.println(String.format("Processed page %d", page));
      result.putAll(pageData);
      ++page;
    } while (result.size() < GithubApiConstants.SEARCH_RESULTS_LIMIT && pageData.size() == PAGE_SIZE);

    return result;
  }

  private GithubDataCollectorInput getGithubDataCollectorInput(final String topic, final int page) {
    return GithubDataCollectorInput.builder()
        .millisBetweenDataCollection(MILLIS_BETWEEN_DATA_COLLECTION)
        .pageSize(PAGE_SIZE)
        .verbose(true)
        .topic(topic)
        .page(page)
        .build();
  }
}
