package adapters;

import models.github.Repository;
import models.github.RepositoryLanguages;
import models.github.SearchResult;
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

public class GithubAdapterIntegrationTests {
  private static final String OWNER_LOGIN = "StefanCosminR";
  private static final String REPOSITORY_NAME = "sato";
  private static final int START_AFTER_ID = 0;
  private static final String TOPIC = "web";
  private static final int PAGE_SIZE = 30;
  private static final int PAGE = 1;

  private GithubAdapter adapter;

  private static Stream<Arguments> getRepository() {
    Repository repository = Repository.builder()
        .owner(User.builder().login(OWNER_LOGIN).build())
        .name(REPOSITORY_NAME)
        .build();
    return Stream.of(Arguments.arguments(repository));
  }

  @BeforeEach
  void setup() throws IOException {
    adapter = new GithubAdapter();
  }

  @Test
  void test_list_repositories() {
    List<Repository> repos = adapter.listRepositories(START_AFTER_ID);
    assertNotNull(repos);
  }

  @ParameterizedTest
  @MethodSource("getRepository")
  void test_get_repository_topics(final Repository repository) {
    TopicList topics = adapter.getRepositoryTopics(repository);
    assertNotNull(topics);
  }

  @Test
  void test_get_repository_info() {
    Repository repository = adapter.getRepositoryInfo(OWNER_LOGIN, REPOSITORY_NAME);
    assertNotNull(repository);
  }

  @Test
  void test_get_contributors() {
    List<User> contributors = adapter.getContributors(adapter.getRepositoryInfo(OWNER_LOGIN, REPOSITORY_NAME));
    assertNotNull(contributors);
  }

  @Test
  void test_get_languages() {
    RepositoryLanguages languages = adapter.getLanguages(adapter.getRepositoryInfo(OWNER_LOGIN, REPOSITORY_NAME));
    assertNotNull(languages);
  }

  @Test
  void test_search_repository_by_topic() {
    SearchResult result = adapter.searchRepositoryByTopic(TOPIC, PAGE, PAGE_SIZE);
    assertNotNull(result);
  }
}
