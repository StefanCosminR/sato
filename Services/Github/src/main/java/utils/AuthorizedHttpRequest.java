package utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.ws.rs.core.HttpHeaders;
import java.net.http.HttpRequest;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class AuthorizedHttpRequest {
  private static final String GITHUB_AUTH_TOKEN_PREFIX = "token ";

  public static HttpRequest githubAuth(final HttpRequest.Builder requestBuilder, final String authToken) {
    return requestBuilder.setHeader(HttpHeaders.AUTHORIZATION, formatGithubToken(authToken)).build();
  }

  private static String formatGithubToken(final String token) {
    if (token.startsWith(GITHUB_AUTH_TOKEN_PREFIX)) {
      return token;
    }
    return String.format("%s%s", GITHUB_AUTH_TOKEN_PREFIX, token);
  }
}
