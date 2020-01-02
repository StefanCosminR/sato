package utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import models.github.ErrorResponse;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class HttpRequests {
  private static ObjectMapper objectMapper = new ObjectMapper();

  public static HttpClient getHttpClient() {
    return HttpClient.newBuilder()
        .connectTimeout(Duration.ofMinutes(1))
        .version(HttpClient.Version.HTTP_1_1)
        .build();
  }

  public static HttpRequest.Builder get(final String uri) {
    return HttpRequest.newBuilder()
        .timeout(Duration.ofMinutes(1))
        .uri(URI.create(uri))
        .GET();
  }

  public static String getResponseBody(final HttpResponse<String> response) throws JsonProcessingException {
    if (response.statusCode() == 200) {
      return response.body();
    }
    ErrorResponse error = objectMapper.readValue(response.body(), ErrorResponse.class);
    throw new RuntimeException(String.format("%s (%s).", error.getMessage(), error.getDocumentationUrl()));
  }
}
