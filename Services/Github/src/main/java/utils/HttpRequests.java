package utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import models.github.ErrorResponse;

import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class HttpRequests {
  private static ObjectMapper objectMapper = new ObjectMapper();

  public static HttpRequest.Builder get(final String uri) {
    return HttpRequest.newBuilder().GET().uri(URI.create(uri));
  }

  public static String getResponseBody(final HttpResponse<String> response) throws JsonProcessingException {
    if (response.statusCode() == 200) {
      return response.body();
    }
    ErrorResponse error = objectMapper.readValue(response.body(), ErrorResponse.class);
    throw new RuntimeException(String.format("%s (%s).", error.getMessage(), error.getDocumentationUrl()));
  }
}
