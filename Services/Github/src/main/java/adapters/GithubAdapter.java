package adapters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import models.github.Repository;
import models.github.RepositoryLanguages;
import models.github.SearchResult;
import models.github.TopicList;
import models.github.User;
import utils.HttpRequests;

import javax.ws.rs.core.HttpHeaders;
import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.List;

import static java.net.http.HttpResponse.BodyHandlers;

@Log4j2
@AllArgsConstructor
public class GithubAdapter {
  private static final String API_CALL_FORMAT = "https://api.github.com/%s";
  private static final String REPOSITORY_INFO_ENDPOINT_FORMAT = "repos/%s/%s";
  private static final String REPOSITORIES_ENDPOINT_FORMAT = "repositories?since=%s";
  private static final String REPOSITORY_TOPICS_ENDPOINT_FORMAT = "repos/%s/%s/topics";
  private static final String GITHUB_CUSTOM_MEDIA_TYPE = "application/vnd.github.mercy-preview+json";
  private static final String SEARCH_BY_TOPIC_ENDPOINT_FORMAT = "search/repositories?q=topic:%s&page=%d&per_page=%d";

  private HttpClient client;
  private ObjectMapper objectMapper;

  public GithubAdapter() {
    this.client = HttpClient.newHttpClient();
    this.objectMapper = new ObjectMapper();
  }

  private static String formatEndpoint(final String endpoint) {
    return String.format(API_CALL_FORMAT, endpoint);
  }

  public SearchResult searchRepositoryByTopic(final String topic, final int page, final int pageSize) {
    try {
      String endpoint = String.format(SEARCH_BY_TOPIC_ENDPOINT_FORMAT, topic, page, pageSize);
      HttpRequest request = HttpRequests.get(formatEndpoint(endpoint)).build();
      HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), SearchResult.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the searchRepositoryByTopic API: {}", e.getMessage());
      return SearchResult.builder().build();
    }
  }

  public List<Repository> listRepositories(final int startAfterId) {
    try {
      String endpoint = String.format(REPOSITORIES_ENDPOINT_FORMAT, startAfterId);
      HttpRequest request = HttpRequests.get(formatEndpoint(endpoint)).build();
      HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), new TypeReference<List<Repository>>(){});
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the listRepositories API: {}", e.getMessage());
      return Collections.emptyList();
    }
  }

  public TopicList getRepositoryTopics(final Repository repository) {
    try {
      String endpoint = String.format(REPOSITORY_TOPICS_ENDPOINT_FORMAT,
                                      repository.getOwner().getLogin(),
                                      repository.getName());

      HttpRequest request = HttpRequests.get(formatEndpoint(endpoint))
          .setHeader(HttpHeaders.ACCEPT, GITHUB_CUSTOM_MEDIA_TYPE)
          .build();

      HttpResponse<String> response = client.send(request, BodyHandlers.ofString());

      return objectMapper.readValue(HttpRequests.getResponseBody(response), TopicList.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getRepositoryTopics API: {}", e.getMessage());
      return TopicList.builder().build();
    }
  }

  public Repository getRepositoryInfo(final String ownerLogin, final String repositoryName) {
    try {
      String endpoint = String.format(REPOSITORY_INFO_ENDPOINT_FORMAT, ownerLogin, repositoryName);
      HttpRequest request = HttpRequests.get(formatEndpoint(endpoint)).build();
      HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), Repository.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getRepositoryInfo API: {}", e.getMessage());
      return Repository.builder().build();
    }
  }

  public List<User> getContributors(final Repository repository) {
    try {
      HttpResponse<String> response = client.send(HttpRequests.get(repository.getContributorsUrl()).build(),
                                                  BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), new TypeReference<List<User>>(){});
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getContributors API: {}", e.getMessage());
      return Collections.emptyList();
    }
  }

  public RepositoryLanguages getLanguages(final Repository repository) {
    try {
      HttpResponse<String> response = client.send(HttpRequests.get(repository.getLanguagesUrl()).build(),
                                                  BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), RepositoryLanguages.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getLanguages API: {}", e.getMessage());
      return new RepositoryLanguages();
    }
  }
}
