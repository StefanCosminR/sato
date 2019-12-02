package utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.net.URI;
import java.net.http.HttpRequest;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class HttpRequests {
  public static HttpRequest.Builder get(final String uri) {
    return HttpRequest.newBuilder().GET().uri(URI.create(uri));
  }
}
