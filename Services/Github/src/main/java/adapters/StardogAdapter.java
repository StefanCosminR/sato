package adapters;

import com.complexible.stardog.StardogException;
import com.complexible.stardog.api.Connection;
import com.complexible.stardog.api.ConnectionPool;
import com.complexible.stardog.api.admin.AdminConnection;
import com.stardog.stark.io.RDFFormats;
import com.stardog.stark.query.SelectQueryResult;
import lombok.extern.log4j.Log4j2;
import persistence.StardogConnectionManager;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Collection;

@Log4j2
public class StardogAdapter {
  private static final int CONNECTION_VALIDITY_TIME = 300;
  private static final boolean USE_REASONING = true;
  private static final int BLOCK_AT_CAPACITY = 900;

  private ConnectionPool connectionPool;
  private String username;
  private String password;
  private String database;
  private String url;

  public StardogAdapter(final String url, final String username, final String password, final String database) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.database = database;
    this.connectionPool = StardogConnectionManager.createConnectionPool(
        StardogConnectionManager.createConnectionConfig(url, username, password, database, USE_REASONING),
        CONNECTION_VALIDITY_TIME,
        BLOCK_AT_CAPACITY
    );
  }

  public void createDatabase(final boolean overrideExistent) {
    try (final AdminConnection connection = StardogConnectionManager.getAdminConnection(url, username, password)) {
      if (overrideExistent) {
        dropDatabase(connection, database);
      }
      if (!connection.list().contains(database)) {
        connection.newDatabase(database).create();
      }
    }
  }

  public void dropDatabase() {
    try (final AdminConnection connection = StardogConnectionManager.getAdminConnection(url, username, password)) {
      dropDatabase(connection, database);
    }
  }

  public Collection<String> listDatabases() {
    try (final AdminConnection connection = StardogConnectionManager.getAdminConnection(url, username, password)) {
      return connection.list();
    }
  }

  public void insertData(final String dataFilePath) throws FileNotFoundException {
    Connection connection = connectionPool.obtain();
    try {
      connection.begin();
      connection.add().io().format(RDFFormats.PRETTY_TURTLE).stream(new FileInputStream(dataFilePath));
      connection.commit();
    } finally {
      releaseConnection(connection);
    }
  }

  public SelectQueryResult query(final String sparqlQuery) {
    Connection connection = connectionPool.obtain();
    try {
      return connection.select(sparqlQuery).execute();
    } finally {
      releaseConnection(connection);
    }
  }

  private void dropDatabase(final AdminConnection connection, final String database) {
    Collection<String> databases = connection.list();
    if (databases.contains(database)) {
      connection.drop(database);
    }
  }

  private void releaseConnection(Connection connection) {
    try {
      connectionPool.release(connection);
    } catch (StardogException e) {
      log.error("An error occurred while releasing Stardog connection: {}", e.getMessage());
    }
  }
}
