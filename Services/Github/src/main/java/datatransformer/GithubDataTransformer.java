package datatransformer;

import com.stardog.stark.vocabs.RDF;
import constants.github.ontology.GithubOntologyObjects;
import constants.github.ontology.GithubOntologyPredicates;
import lombok.NoArgsConstructor;
import models.github.Repository;
import models.github.RepositoryDataCollection;

import java.net.MalformedURLException;
import java.net.URL;

@NoArgsConstructor
public class GithubDataTransformer {
  private static final String NAMESPACE_DELIMITER = ":";

  public static String toTurtle(final RepositoryDataCollection repositoryInfo) {
    Repository repository = repositoryInfo.getGeneralData();

    StringBuilder entry = new StringBuilder();

    entry.append(getTurtleEntry(repository.getHtmlUrl(),
                                RDF.TYPE.toString(),
                                GithubOntologyObjects.REPOSITORY));

    entry.append(getTurtleEntry(repository.getOwner().getProfileUrl(),
                                RDF.TYPE.toString(),
                                GithubOntologyObjects.GITHUB_USER));

    entry.append(getTurtleEntry(repository.getOwner().getProfileUrl(),
                                GithubOntologyPredicates.OWNS,
                                repository.getHtmlUrl()));

    entry.append(getTurtleEntry(repository.getHtmlUrl(),
                                GithubOntologyPredicates.HAS_STARS,
                                repository.getStargazersCount()));

    repositoryInfo.getTopics().getNames().forEach(topic -> {
      entry.append(getTurtleEntry(topic,
                                  RDF.TYPE.toString(),
                                  GithubOntologyObjects.TOPIC));

      entry.append(getTurtleEntry(repository.getHtmlUrl(),
                                  GithubOntologyPredicates.HAS_TOPIC,
                                  topic));
    });

    repositoryInfo.getLanguages().getLanguages().forEach(language -> {
      entry.append(getTurtleEntry(language,
                                  RDF.TYPE.toString(),
                                  GithubOntologyObjects.PROGRAMMING_LANGUAGE));

      entry.append(getTurtleEntry(repository.getHtmlUrl(),
                                  GithubOntologyPredicates.HAS_PROGRAMMING_LANGUAGE,
                                  language));
    });

    repositoryInfo.getContributors().forEach(contributor -> {
      entry.append(getTurtleEntry(contributor.getProfileUrl(),
                                  RDF.TYPE.toString(),
                                  GithubOntologyObjects.GITHUB_USER));

      entry.append(getTurtleEntry(contributor.getProfileUrl(),
                                  RDF.TYPE.toString(),
                                  GithubOntologyObjects.CONTRIBUTOR));

      entry.append(getTurtleEntry(repository.getHtmlUrl(),
                                  GithubOntologyPredicates.HAS_CONTRIBUTOR,
                                  contributor.getProfileUrl()));
    });

    return entry.toString();
  }

  private static String getTurtleEntry(final String subject, final String predicate, final String object) {
    return String.format("%s %s %s .\n",
                         transformTurtleEntryComponent(subject),
                         transformTurtleEntryComponent(predicate),
                         transformTurtleEntryComponent(object));
  }

  private static String getTurtleEntry(final String subject, final String predicate, final Number object) {
    return String.format("%s %s %s .\n",
                         transformTurtleEntryComponent(subject),
                         transformTurtleEntryComponent(predicate),
                         object);
  }

  private static String transformTurtleEntryComponent(final String component) {
    try {
      new URL(component);
      return String.format("<%s>", component);
    } catch (MalformedURLException e) {
      return transformNonUrlTurtleEntryComponent(component);
    }
  }

  private static String transformNonUrlTurtleEntryComponent(final String component) {
    if (!component.matches(String.format(".*%s.*", NAMESPACE_DELIMITER))) {
      return String.format("%s%s", NAMESPACE_DELIMITER, component);
    }
    return component;
  }
}
