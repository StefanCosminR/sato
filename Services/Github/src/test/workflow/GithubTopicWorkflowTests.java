package workflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import constants.github.GithubConfigConstants;
import models.config.GithubConfig;
import models.workflow.GithubTopicWorkflowParams;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

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

  @Test
  public void test_run_workflow_on_all_topics() throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    List<String> topics = objectMapper.readValue(GithubConfigConstants.CONFIG_FILE, GithubConfig.class).getTopics();

    topics.forEach(topic -> {
      try {
        System.out.println(String.format("Collecting topic: %s", topic));
        workflow.start(topic, false);
        System.out.println("Waiting request rate limit reset...");
        TimeUnit.HOURS.sleep(1);
      } catch (FileNotFoundException | InterruptedException e) {
        e.printStackTrace();
      }
    });
  }
}
