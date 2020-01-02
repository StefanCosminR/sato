package models.workflow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GithubTopicWorkflowParams {
  private String storageUsername;
  private String storagePassword;
  private String storageUrl;
  private String database;
}
