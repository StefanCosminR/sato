package integration.adapters;

import adapters.GithubAdapter;
import models.github.Repository;
import models.github.TopicList;
import models.github.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GithubAdapterTest {
  private static final int START_AFTER_ID = 0;

  private GithubAdapter adapter;

  private static Stream<Arguments> getRepository() {
    Repository repository = Repository.builder()
        .owner(User.builder().login("StefanCosminR").build())
        .name("sato")
        .build();
    return Stream.of(Arguments.arguments(repository));
  }

  @BeforeEach
  void setup() {
    adapter = new GithubAdapter();
  }

  @Test
  void test_list_repositories() throws IOException {
    List<Repository> repos = adapter.listRepositories(START_AFTER_ID);
    assertNotNull(repos);
  }

  @ParameterizedTest
  @MethodSource("getRepository")
  void test_get_repository_topics(final Repository repository) {
    TopicList topics = adapter.getRepositoryTopics(repository);
    assertNotNull(topics);
  }
}
