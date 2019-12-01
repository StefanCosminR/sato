package unit.adapters;

import adapters.GithubAdapter;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.github.Repository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import utils.HttpRequests;

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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
public class GithubAdapterTest {
  private static final int START_AFTER_ID = 0;
  private static final String EMPTY_JSON_LIST = "[]";

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

  @BeforeEach
  void setup() {
    adapter = new GithubAdapter(client, new ObjectMapper());
  }

  @ParameterizedTest
  @MethodSource("getListRepositoriesArguments")
  void test_list_repository_api_is_called_as_expected(HttpRequest expectedApiRequest)
      throws IOException, InterruptedException {
    doReturn(EMPTY_JSON_LIST).when(response).body();
    doReturn(response).when(client).send(expectedApiRequest, BodyHandlers.ofString());
    List<Repository> results = adapter.listRepositories(START_AFTER_ID);
    verify(client, times(1)).send(expectedApiRequest, BodyHandlers.ofString());
    assertEquals(results, Collections.emptyList());
  }

  @AfterEach
  void after() {
    verifyNoMoreInteractions(client);
  }
}
