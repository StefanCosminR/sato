package utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.ws.rs.core.HttpHeaders;
import java.net.http.HttpRequest;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class AuthorizedHttpRequest {
  public static HttpRequest githubAuth(final HttpRequest.Builder requestBuilder, final String authToken) {
    return requestBuilder.setHeader(HttpHeaders.AUTHORIZATION, formatGithubToken(authToken)).build();
  }

  private static String formatGithubToken(final String token) {
    return String.format("token %s", token);
  }
}
