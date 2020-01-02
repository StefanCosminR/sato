package adapters;

import com.stardog.stark.query.SelectQueryResult;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class StardogAdapterTests {
  private static final String TEST_TTL_FILE_PATH = "ttl/test/stardog_test.ttl";
  private static final String SELECT_ALL_QUERY = "select * where { ?s ?p ?o }";
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

  @Test
  public void test_insert_data_from_file() throws FileNotFoundException {
    adapter.createDatabase();
    adapter.insertData(TEST_TTL_FILE_PATH);
  }

  @Test
  public void test_query() throws FileNotFoundException {
    adapter.createDatabase();
    adapter.insertData(TEST_TTL_FILE_PATH);
    SelectQueryResult result = adapter.query(SELECT_ALL_QUERY);
    assertNotNull(result);
    assertEquals(Arrays.asList("s", "p", "o"), result.variables());
  }

  @AfterEach
  public void cleanup() {
    adapter.dropDatabase();
  }
}
