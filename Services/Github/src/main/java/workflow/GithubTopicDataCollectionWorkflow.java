package workflow;

import adapters.GithubAdapter;
import constants.github.GithubApiConstants;
import constants.turtle.TurtleNamespace;
import datacollector.GithubDataCollector;
import datatransformer.GithubDataTransformer;
import lombok.AllArgsConstructor;
import models.datacollector.GithubDataCollectorInput;
import models.datacollector.GithubDataCollectorOutput;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

@AllArgsConstructor
public class GithubTopicDataCollectionWorkflow {
  private static final String TOPIC_DATA_FILE_PATH = "ttl/github-topics-data.ttl";
  private static final int MILLIS_BETWEEN_DATA_COLLECTION = 300;
  private static final int PAGE_SIZE = 50;

  private GithubDataCollector collector;

  public GithubTopicDataCollectionWorkflow() throws IOException {
    this.collector = new GithubDataCollector(new GithubAdapter());
  }

  public void start(final String topic) throws FileNotFoundException {
    System.out.println(String.format("Collecting repositories for topic '%s'...", topic));
    storeInTurtleFile(collectTopicData(topic), TOPIC_DATA_FILE_PATH);
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

  private void storeInTurtleFile(final GithubDataCollectorOutput topicData,
                                 final String writePath) throws FileNotFoundException {
    PrintWriter dataFile = new PrintWriter(writePath);
    dataFile.println(getNamespaces());
    dataFile.flush();
    topicData.forEach((repositoryId, repositoryInfo) -> {
      System.out.println(String.format("Transforming %s...", repositoryInfo.getGeneralData().getFullName()));
      dataFile.println(GithubDataTransformer.toTurtle(repositoryInfo));
      dataFile.flush();
    });
  }

  private String getNamespaces() {
    StringBuilder namespaces = new StringBuilder();
    Arrays.stream(TurtleNamespace.values())
        .forEach(namespace -> namespaces.append(formatNamespace(namespace)));
    namespaces.append('\n');
    return namespaces.toString();
  }

  private String formatNamespace(final TurtleNamespace namespace) {
    return String.format("@prefix %s: <%s> .\n", namespace.name().toLowerCase(), namespace.getUrl());
  }
}
