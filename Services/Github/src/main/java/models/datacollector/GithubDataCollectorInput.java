package models.datacollector;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GithubDataCollectorInput {
  private int millisBetweenDataCollection;
  private boolean verbose;
  private String topic;
  private int pageSize;
  private int page;
}
