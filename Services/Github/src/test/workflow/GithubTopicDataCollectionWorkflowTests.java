package workflow;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTimeout;

public class GithubTopicDataCollectionWorkflowTests {
  private static final String TOPIC = "semantic-web";

  private GithubTopicDataCollectionWorkflow workflow;

  @BeforeEach
  void setup() throws IOException {
    workflow = new GithubTopicDataCollectionWorkflow();
  }

  @Test
  public void test_github_topic_data_collector_workflow() {
    assertTimeout(Duration.ofMinutes(60), () -> workflow.start(TOPIC));
  }
}
