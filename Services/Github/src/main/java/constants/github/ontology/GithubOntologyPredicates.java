package constants.github.ontology;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class GithubOntologyPredicates {
  public static String HAS_PROGRAMMING_LANGUAGE = ":hasProgrammingLanguage";
  public static String HAS_CONTRIBUTOR = ":hasContributor";
  public static String CONTRIBUTES_TO = ":contributesTo";
  public static String IS_FOLLOWED_BY = ":isFollowedBy";
  public static String IS_OWNER_BY = ":isOwnedBy";
  public static String HAS_STARS = ":hasStars";
  public static String HAS_TOPIC = ":hasTopic";
  public static String FOLLOWS = ":follows";
  public static String OWNS = ":owns";
}
