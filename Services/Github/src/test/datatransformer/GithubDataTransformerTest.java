package datatransformer;

import adapters.GithubAdapter;
import models.github.Repository;
import models.github.RepositoryDataCollection;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.io.IOException;
import java.util.stream.Stream;

public class GithubDataTransformerTest {
  private static final String OWNER_LOGIN = "StefanCosminR";
  private static final String REPOSITORY_NAME = "sato";

  private static Stream<Arguments> getRepositoryDataCollection() throws IOException {
    GithubAdapter adapter = new GithubAdapter();
    Repository fullRepoInfo = adapter.getRepositoryInfo(OWNER_LOGIN, REPOSITORY_NAME);
    return Stream.of(Arguments.of(
        RepositoryDataCollection.builder()
            .contributors(adapter.getContributors(fullRepoInfo))
            .topics(adapter.getRepositoryTopics(fullRepoInfo))
            .languages(adapter.getLanguages(fullRepoInfo))
            .generalData(fullRepoInfo)
            .build()
    ));
  }

  @ParameterizedTest
  @MethodSource("getRepositoryDataCollection")
  public void test_transformation_from_repository_to_ttl(final RepositoryDataCollection repositoryInfo) {
    System.out.println(GithubDataTransformer.toTurtle(repositoryInfo));
  }
}
