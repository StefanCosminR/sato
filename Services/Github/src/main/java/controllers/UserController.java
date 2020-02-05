package controllers;

import adapters.GithubAdapter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Set;

@RestController
@RequestMapping("/user")
public class UserController {

  private GithubAdapter adapter;

  public UserController() throws IOException {
    adapter = new GithubAdapter();
  }

  @RequestMapping(path = "/interests", method = RequestMethod.GET)
  @CrossOrigin
  public ResponseEntity<Set<String>> collectInterests(final HttpServletRequest request) {
    Set<String> interests = adapter.collectUserInterests(request.getHeader(HttpHeaders.AUTHORIZATION));
    return new ResponseEntity<>(interests, HttpStatus.OK);
  }

  @RequestMapping(path = "/interests", method = RequestMethod.POST)
  @CrossOrigin
  public ResponseEntity<String> setInterests(final HttpServletRequest request, final @RequestBody String[] interests) {
    adapter.setUserInterests(request.getHeader(HttpHeaders.AUTHORIZATION), interests);
    return new ResponseEntity<>("", HttpStatus.OK);
  }
}
