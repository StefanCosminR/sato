package constants.github;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum GithubApiHeaders {
  RATE_LIMIT_REMAINING_HEADER("X-RateLimit-Remaining"),
  RATE_LIMIT_RESET_HEADER("X-RateLimit-Reset");

  private String value;
}
