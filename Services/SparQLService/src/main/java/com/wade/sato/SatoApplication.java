package com.wade.sato;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.wade.sato.controllers"})
public class SatoApplication {

  public static void main(String[] args) {
    SpringApplication.run(SatoApplication.class, args);
  }
}
