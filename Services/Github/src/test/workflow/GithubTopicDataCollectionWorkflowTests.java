package workflow;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

public class GithubTopicDataCollectionWorkflowTests {
  private static final String TOPIC = "semantic";

  private GithubTopicDataCollectionWorkflow workflow;

  @BeforeEach
  void setup() throws IOException {
    workflow = new GithubTopicDataCollectionWorkflow();
  }

  @Test
  public void test_github_topic_data_collector_workflow() {
    workflow.start(TOPIC);
  }
}
