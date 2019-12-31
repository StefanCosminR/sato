package adapters;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class StardogAdapterTests {
  private static final String URL = "http://localhost:5820";
  private static final String DATABASE = "stardog_test";
  private static final String USERNAME = "admin";
  private static final String PASSWORD = "admin";

  private StardogAdapter adapter;

  @BeforeEach
  public void setup() {
    adapter = new StardogAdapter(URL, USERNAME, PASSWORD, DATABASE);
    adapter.dropDatabase();
  }

  @Test
  public void test_create_database() {
    adapter.createDatabase();
    assertTrue(adapter.listDatabases().contains(DATABASE));
  }

  @Test
  public void test_drop_database() {
    adapter.createDatabase();
    adapter.dropDatabase();
    assertFalse(adapter.listDatabases().contains(DATABASE));
  }

  @AfterEach
  public void cleanup() {
    adapter.dropDatabase();
  }
}
