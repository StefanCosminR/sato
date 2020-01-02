package persistence;

import com.complexible.stardog.api.ConnectionConfiguration;
import com.complexible.stardog.api.ConnectionPool;
import com.complexible.stardog.api.ConnectionPoolConfig;
import com.complexible.stardog.api.admin.AdminConnection;
import com.complexible.stardog.api.admin.AdminConnectionConfiguration;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.concurrent.TimeUnit;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class StardogConnectionManager {
  public static ConnectionConfiguration createConnectionConfig(final String url,
                                                               final String username,
                                                               final String password,
                                                               final String database,
                                                               final boolean useReasoning) {
    return ConnectionConfiguration.to(database).server(url).credentials(username, password).reasoning(useReasoning);
  }

  public static ConnectionPool createConnectionPool(final ConnectionConfiguration connectionConfig,
                                                    final int connectionValidityTime,
                                                    final int blockAtCapacity) {
    return ConnectionPoolConfig
        .using(connectionConfig)
        .expiration(connectionValidityTime, TimeUnit.SECONDS)
        .blockAtCapacity(blockAtCapacity, TimeUnit.SECONDS)
        .create();
  }

  public static AdminConnection getAdminConnection(final String url, final String username, final String password) {
    return AdminConnectionConfiguration
        .toServer(url)
        .credentials(username, password)
        .connect();
  }
}
