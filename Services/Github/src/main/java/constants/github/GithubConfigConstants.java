package constants.github;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.io.File;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class GithubConfigConstants {
  public static final File CONFIG_FILE = new File("config/github-config.json");
}
