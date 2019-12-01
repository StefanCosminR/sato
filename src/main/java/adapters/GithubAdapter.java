package adapters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import models.github.Repository;
import utils.HttpRequests;

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
  private static final String REPOSITORIES_ENDPOINT_FORMAT = "repositories?since=%s";

  private HttpClient client;
  private ObjectMapper objectMapper;

  public GithubAdapter() {
    this.client = HttpClient.newHttpClient();
    this.objectMapper = new ObjectMapper();
  }

  private static String formatEndpoint(final String endpoint) {
    return String.format(API_CALL_FORMAT, endpoint);
  }

  public List<Repository> listRepositories(final int startAfterId) {
    try {
      String endpoint = String.format(REPOSITORIES_ENDPOINT_FORMAT, startAfterId);
      HttpRequest request = HttpRequests.get(formatEndpoint(endpoint)).build();
      HttpResponse<String> response = client.send(request, BodyHandlers.ofString());
      return objectMapper.readValue(response.body(), new TypeReference<List<Repository>>(){});
    } catch (InterruptedException | IOException e) {
      log.error("An error occurred while calling the listRepository API: {}", e.getMessage());
      return Collections.emptyList();
    }
  }
}
