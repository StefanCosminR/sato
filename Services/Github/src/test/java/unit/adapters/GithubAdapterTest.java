package unit.adapters;

import adapters.GithubAdapter;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.github.Repository;
import models.github.TopicList;
import models.github.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import utils.HttpRequests;

import javax.ws.rs.core.HttpHeaders;
import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import static java.net.http.HttpResponse.BodyHandlers;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
public class GithubAdapterTest {
  private static final String EMPTY_TOPIC_LIST = "{ \"name\": [] }";
  private static final String REPOSITORY_NAME = "projectName";
  private static final String EMPTY_JSON_LIST = "[]";
  private static final String USERNAME = "username";
  private static final int START_AFTER_ID = 0;

  @Mock
  private HttpClient client;
  @Mock
  private HttpResponse<String> response;

  private GithubAdapter adapter;

  private static Stream<Arguments> getListRepositoriesArguments() {
    return Stream.of(Arguments.of(
        HttpRequests.get(String.format("https://api.github.com/repositories?since=%d", START_AFTER_ID)).build()
    ));
  }

  private static Stream<Arguments> getRepositoryTopicsArguments() {
    return Stream.of(Arguments.of(
        Repository.builder()
            .owner(User.builder().login(USERNAME).build())
            .name(REPOSITORY_NAME)
            .build(),
        HttpRequests
            .get(String.format("https://api.github.com/repos/%s/%s/topics", USERNAME, REPOSITORY_NAME))
            .setHeader(HttpHeaders.ACCEPT, "application/vnd.github.mercy-preview+json")
            .build()
    ));
  }

  @BeforeEach
  void setup() {
    adapter = new GithubAdapter(client, new ObjectMapper());
  }

  @ParameterizedTest
  @MethodSource("getListRepositoriesArguments")
  void test_list_repository_api_is_called_as_expected(final HttpRequest request)
      throws IOException, InterruptedException {
    doReturn(EMPTY_JSON_LIST).when(response).body();
    doReturn(response).when(client).send(request, BodyHandlers.ofString());
    List<Repository> results = adapter.listRepositories(START_AFTER_ID);
    verify(client, times(1)).send(request, BodyHandlers.ofString());
    assertEquals(results, Collections.emptyList());
  }

  @ParameterizedTest
  @MethodSource("getListRepositoriesArguments")
  void test_list_repository_operation_does_not_crush_if_error_occurred(final HttpRequest request)
      throws IOException, InterruptedException {
    doThrow(new IOException("CRUSH TEST")).when(client).send(request, BodyHandlers.ofString());
    List<Repository> results = adapter.listRepositories(START_AFTER_ID);
    verify(client, times(1)).send(request, BodyHandlers.ofString());
    assertEquals(results, Collections.emptyList());
  }

  @ParameterizedTest
  @MethodSource("getRepositoryTopicsArguments")
  void test_get_repository_topics_is_called_as_expected(final Repository repository, final HttpRequest request)
      throws IOException, InterruptedException {
    doReturn(EMPTY_TOPIC_LIST).when(response).body();
    doReturn(response).when(client).send(request, BodyHandlers.ofString());
    TopicList result = adapter.getRepositoryTopics(repository);
    verify(client, times(1)).send(request, BodyHandlers.ofString());
    assertEquals(result, TopicList.builder().build());
  }

  @ParameterizedTest
  @MethodSource("getRepositoryTopicsArguments")
  void test_get_repository_topics_does_not_crush_if_error_occurred(final Repository repository,
                                                                   final HttpRequest request)
      throws IOException, InterruptedException {
    doThrow(new IOException("CRUSH TEST")).when(client).send(request, BodyHandlers.ofString());
    TopicList result = adapter.getRepositoryTopics(repository);
    verify(client, times(1)).send(request, BodyHandlers.ofString());
    assertEquals(result, TopicList.builder().build());
  }

  @AfterEach
  void after() {
    verifyNoMoreInteractions(client, response);
  }
}
