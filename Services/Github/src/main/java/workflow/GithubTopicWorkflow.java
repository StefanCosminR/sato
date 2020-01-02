package workflow;

import adapters.GithubAdapter;
import adapters.StardogAdapter;
import constants.github.GithubApiConstants;
import constants.turtle.TurtleNamespace;
import datacollector.GithubDataCollector;
import datatransformer.GithubDataTransformer;
import lombok.AllArgsConstructor;
import models.datacollector.GithubDataCollectorInput;
import models.datacollector.GithubDataCollectorOutput;
import models.workflow.GithubTopicWorkflowParams;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

@AllArgsConstructor
public class GithubTopicWorkflow {
  private static final String TOPIC_DATA_FILE_PATH = "ttl/github-topics-data.ttl";
  private static final int MILLIS_BETWEEN_DATA_COLLECTION = 300;
  private static final int PAGE_SIZE = 30;

  private GithubDataCollector collector;
  private StardogAdapter adapter;

  public GithubTopicWorkflow(final GithubTopicWorkflowParams params) throws IOException {
    this.collector = new GithubDataCollector(new GithubAdapter());
    this.adapter = new StardogAdapter(params.getStorageUrl(),
                                      params.getStorageUsername(),
                                      params.getStoragePassword(),
                                      params.getDatabase());
  }

  public void start(final String topic) throws FileNotFoundException {
    GithubDataCollectorOutput pageData;
    int totalResults = 0;
    int page = 1;

    adapter.createDatabase();
    do {
      System.out.println(String.format("> Processing page %d", page));
      pageData = collector.collect(getGithubDataCollectorInput(topic, page));
      storeInTurtleFile(pageData, TOPIC_DATA_FILE_PATH);
      adapter.insertData(TOPIC_DATA_FILE_PATH);
      totalResults += PAGE_SIZE;
      ++page;
    } while (totalResults < GithubApiConstants.SEARCH_RESULTS_LIMIT && pageData.size() > 0);
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
    String namespacePrefix;
    if (namespace == TurtleNamespace.SATO) {
      namespacePrefix = "";
    } else {
      namespacePrefix = namespace.name().toLowerCase();
    }
    return String.format("@prefix %s: <%s> .\n", namespacePrefix, namespace.getUrl());
  }
}
