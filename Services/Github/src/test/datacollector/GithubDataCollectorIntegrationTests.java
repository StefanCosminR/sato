package datacollector;

import adapters.GithubAdapter;
import models.datacollector.GithubResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GithubDataCollectorIntegrationTests {
  private static final int START_AFTER_ID = 0;
  private static final int MILLIS_BETWEEN_DATA_COLLECTION = 300;

  private GithubDataCollector collector;

  @BeforeEach
  void setup() {
    collector = new GithubDataCollector(new GithubAdapter());
  }

  @Test
  void test_data_collection() {
    GithubResult result = collector.collect(START_AFTER_ID, MILLIS_BETWEEN_DATA_COLLECTION, true);
    assertNotNull(result);
  }
}
