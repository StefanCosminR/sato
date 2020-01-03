package com.wade.sato.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.io.File;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class StardogConfigConstants {
  public static final File CONFIG_FILE = new File("config/stardog-config.json");
}
