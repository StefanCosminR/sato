package adapters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import constants.github.GithubConfigConstants;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import models.config.GithubConfig;
import models.github.RateLimit;
import models.github.Repository;
import models.github.RepositoryLanguages;
import models.github.SearchResult;
import models.github.TopicList;
import models.github.User;
import utils.AuthorizedHttpRequest;
import utils.HttpRequests;
import utils.TaskExecutioner;

import javax.ws.rs.core.HttpHeaders;
import java.io.IOException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

import static java.net.http.HttpResponse.BodyHandlers;

@Log4j2
@AllArgsConstructor
public class GithubAdapter {
  private static final int PAGE_SIZE = 30;
  private static final String RATE_LIMIT_ENDPOINT = "rate_limit";
  private static final String API_CALL_FORMAT = "https://api.github.com/%s";
  private static final String REPOSITORY_INFO_ENDPOINT_FORMAT = "repos/%s/%s";
  private static final String REPOSITORIES_ENDPOINT_FORMAT = "repositories?since=%s";
  private static final String REPOSITORY_TOPICS_ENDPOINT_FORMAT = "repos/%s/%s/topics";
  private static final String USER_REPOSITORIES_ENDPOINT_FORMAT = "user/repos?page=%d&per_page=%d";
  private static final String GITHUB_CUSTOM_MEDIA_TYPE = "application/vnd.github.mercy-preview+json";
  private static final String SEARCH_BY_TOPIC_ENDPOINT_FORMAT = "search/repositories?q=topic:%s&page=%d&per_page=%d";

  private String authToken;
  private ObjectMapper objectMapper;

  public GithubAdapter() throws IOException {
    this.objectMapper = new ObjectMapper();
    this.authToken = objectMapper.readValue(GithubConfigConstants.CONFIG_FILE, GithubConfig.class).getAuthToken();
  }

  private static String formatEndpoint(final String endpoint) {
    return String.format(API_CALL_FORMAT, endpoint);
  }

  public RateLimit checkRateLimit() {
    try {
      HttpRequest.Builder requestBuilder = HttpRequests.get(formatEndpoint(RATE_LIMIT_ENDPOINT));
      HttpRequest request = AuthorizedHttpRequest.githubAuth(requestBuilder, authToken);
      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), RateLimit.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the searchRepositoryByTopic API: {}", e.getMessage());
      return RateLimit.builder().build();
    }
  }

  public SearchResult searchRepositoryByTopic(final String topic, final int page, final int pageSize) {
    try {
      String endpoint = String.format(SEARCH_BY_TOPIC_ENDPOINT_FORMAT, topic, page, pageSize);
      HttpRequest request = AuthorizedHttpRequest.githubAuth(HttpRequests.get(formatEndpoint(endpoint)), authToken);
      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), SearchResult.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the searchRepositoryByTopic API: {}", e.getMessage());
      return SearchResult.builder().build();
    }
  }

  public List<Repository> listRepositories(final int startAfterId) {
    try {
      String endpoint = String.format(REPOSITORIES_ENDPOINT_FORMAT, startAfterId);
      HttpRequest request = AuthorizedHttpRequest.githubAuth(HttpRequests.get(formatEndpoint(endpoint)), authToken);
      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), new TypeReference<List<Repository>>(){});
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the listRepositories API: {}", e.getMessage());
      return Collections.emptyList();
    }
  }

  public TopicList getRepositoryTopics(final Repository repository) {
    return getRepositoryTopics(repository, authToken);
  }

  public TopicList getRepositoryTopics(final Repository repository, final String authToken) {
    try {
      String endpoint = String.format(REPOSITORY_TOPICS_ENDPOINT_FORMAT,
                                      repository.getOwner().getLogin(),
                                      repository.getName());

      HttpRequest.Builder requestBuilder = HttpRequests
          .get(formatEndpoint(endpoint))
          .setHeader(HttpHeaders.ACCEPT, GITHUB_CUSTOM_MEDIA_TYPE);

      HttpRequest request = AuthorizedHttpRequest.githubAuth(requestBuilder, authToken);

      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());

      return objectMapper.readValue(HttpRequests.getResponseBody(response), TopicList.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getRepositoryTopics API: {}", e.getMessage());
      return TopicList.builder().build();
    }
  }

  public Repository getRepositoryInfo(final String ownerLogin, final String repositoryName) {
    try {
      String endpoint = String.format(REPOSITORY_INFO_ENDPOINT_FORMAT, ownerLogin, repositoryName);
      HttpRequest request = AuthorizedHttpRequest.githubAuth(HttpRequests.get(formatEndpoint(endpoint)), authToken);
      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), Repository.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getRepositoryInfo API: {}", e.getMessage());
      return Repository.builder().build();
    }
  }

  public List<User> getContributors(final Repository repository) {
    return getContributors(repository, authToken);
  }

  public List<User> getContributors(final Repository repository, final String authToken) {
    try {
      HttpRequest request = AuthorizedHttpRequest.githubAuth(HttpRequests.get(repository.getContributorsUrl()), authToken);
      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), new TypeReference<List<User>>(){});
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getContributors API: {}", e.getMessage());
      return Collections.emptyList();
    }
  }

  public RepositoryLanguages getLanguages(final Repository repository) {
    return getLanguages(repository, authToken);
  }

  public RepositoryLanguages getLanguages(final Repository repository, final String authToken) {
    try {
      HttpRequest request = AuthorizedHttpRequest.githubAuth(HttpRequests.get(repository.getLanguagesUrl()), authToken);
      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());
      return objectMapper.readValue(HttpRequests.getResponseBody(response), RepositoryLanguages.class);
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the getLanguages API: {}", e.getMessage());
      return new RepositoryLanguages();
    }
  }

  public List<Repository> collectUserRepositories(final String authToken, final int page, final int pageSize) {
    try {
      String endpoint = String.format(USER_REPOSITORIES_ENDPOINT_FORMAT, page, pageSize);

      HttpRequest.Builder requestBuilder = HttpRequests
          .get(formatEndpoint(endpoint))
          .setHeader(HttpHeaders.ACCEPT, GITHUB_CUSTOM_MEDIA_TYPE);

      HttpRequest request = AuthorizedHttpRequest.githubAuth(requestBuilder, authToken);

      HttpResponse<String> response = HttpRequests.getHttpClient().send(request, BodyHandlers.ofString());

      return objectMapper.readValue(HttpRequests.getResponseBody(response), new TypeReference<List<Repository>>() {
      });
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the collectUserRepositories API: {}", e.getMessage());
      return Collections.emptyList();
    }
  }

  public Set<String> collectUserInterests() {
    return collectUserInterests(authToken);
  }

  public Set<String> collectUserInterests(final String authToken) {
    TaskExecutioner<Set<String>> executioner = new TaskExecutioner<>();
    List<Future<Set<String>>> collectTasks = new ArrayList<>();
    List<Repository> repositoryPage;
    int page = 1;

    do {
      repositoryPage = collectUserRepositories(authToken, page, PAGE_SIZE);
      List<Callable<Set<String>>> tasks = repositoryPage.stream()
          .map(repository -> (Callable<Set<String>>) () -> getRepositoryInterests(repository, authToken))
          .collect(Collectors.toList());
      collectTasks.addAll(executioner.launchTasks(tasks));
      ++page;
    } while (repositoryPage.size() > 0);

    return executioner.collectTaskResults(collectTasks).stream().flatMap(Collection::stream).collect(Collectors.toSet());
  }

  public Set<String> getRepositoryInterests(final Repository repository, final String authToken) {
    Set<String> interests = new HashSet<>(getLanguages(repository, authToken).getLanguages());

    List<String> topics = Optional
        .ofNullable(repository.getTopics())
        .orElseGet(() -> getRepositoryTopics(repository, authToken).getNames());
    interests.addAll(topics);

    return interests;
  }
}
