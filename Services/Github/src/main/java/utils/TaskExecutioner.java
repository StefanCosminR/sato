package utils;

import lombok.extern.log4j.Log4j2;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

@Log4j2
public final class TaskExecutioner<OutputType> {
  private static final int THREAD_POOL_SIZE = 64;

  private ExecutorService executor;

  public TaskExecutioner() {
    executor = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
  }

  public List<Future<OutputType>> launchTasks(final List<Callable<OutputType>> tasks) {
    try {
      return executor.invokeAll(tasks);
    } catch (InterruptedException e) {
      log.error("Could not launch tasks: {}", e.getMessage());
      return Collections.emptyList();
    }
  }

  public List<OutputType> collectTaskResults(final List<Future<OutputType>> tasks) {
    List<OutputType> results = new ArrayList<>();
    for (Future<OutputType> task : tasks) {
      try {
        results.add(task.get());
      } catch (InterruptedException | ExecutionException e) {
        log.error("Could not collect task result.\nTask: {}\n{}", task, e);
      }
    }
    return results;
  }

  public void shutdown() {
    executor.shutdown();
    try {
      if (!executor.awaitTermination(1, TimeUnit.SECONDS)) {
        executor.shutdownNow();
      }
    } catch (InterruptedException e) {
      executor.shutdownNow();
    }
  }
}
