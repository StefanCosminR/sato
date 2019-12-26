package models.github;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryDataCollection {
  private TopicList topics;
  private Repository generalData;
  private List<User> contributors;
  private RepositoryLanguages languages;
}
