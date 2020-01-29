package workflow;

import models.workflow.GithubTopicWorkflowParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.io.IOException;

public class GithubTopicWorkflowTests {
  private static final String URL = "http://localhost:5820";
  private static final String DATABASE = "stardog_test";
  private static final String USERNAME = "admin";
  private static final String PASSWORD = "admin";
  private static final String TOPIC = "snapkit";

  private GithubTopicWorkflow workflow;

  @BeforeEach
  void setup() throws IOException {
    workflow = new GithubTopicWorkflow(new GithubTopicWorkflowParams(USERNAME, PASSWORD, URL, DATABASE));
  }

  @Test
  public void test_github_topic_data_collector_workflow() throws FileNotFoundException {
    workflow.start(TOPIC, true);
  }
}
