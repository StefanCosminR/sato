package datacollector;

import adapters.GithubAdapter;
import models.datacollector.GithubDataCollectorInput;
import models.datacollector.GithubDataCollectorOutput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GithubDataCollectorIntegrationTests {
  private static final int MILLIS_BETWEEN_DATA_COLLECTION = 300;
  private static final String TOPIC = "wade";
  private static final int PAGE_SIZE = 30;
  private static final int PAGE = 1;

  private GithubDataCollector collector;

  private static Stream<Arguments> getGithubDataCollectorInput() {
    return Stream.of(Arguments.of(
        GithubDataCollectorInput.builder()
            .millisBetweenDataCollection(MILLIS_BETWEEN_DATA_COLLECTION)
            .pageSize(PAGE_SIZE)
            .verbose(true)
            .topic(TOPIC)
            .page(PAGE)
            .build()
    ));
  }

  @BeforeEach
  void setup() {
    collector = new GithubDataCollector(new GithubAdapter());
  }

  @ParameterizedTest
  @MethodSource("getGithubDataCollectorInput")
  void test_data_collection(final GithubDataCollectorInput input) {
    GithubDataCollectorOutput result = collector.collect(input);
    assertNotNull(result);
  }
}
