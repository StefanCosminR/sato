package integration.adapters;

import adapters.GithubAdapter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class GithubAdapterTest {
  private static final int START_AFTER_ID = 0;

  private GithubAdapter adapter;

  @BeforeEach
  void setup() {
    adapter = new GithubAdapter();
  }

  @Test
  void test_list_repositories() {
    assertNotNull(adapter.listRepositories(START_AFTER_ID));
  }
}
