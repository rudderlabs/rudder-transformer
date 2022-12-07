const _ = require("lodash");

const sampleEvents = {
  input: {
    sample_event: {
      blankProp: "",
      nullProp: null,
      intProp: 0,
      floatProp: 2.2,
      stringProp: "zero",
      arrayProp: ["zero", "level"],
      objectProp: {
        firstLevelInt: 1,
        firstLevelBool: true,
        firstLevelMap: {
          secondLevelBlankProp: "",
          secondLevelArray: ["second", "level"],
          secondLevelMap: {
            thirdLevelString: "third level",
            thirdLevelMap: {
              fourthLevelInt: 4
            }
          }
        }
      }
    },
    nested_event: {
      intProp: 0,
      floatProp: 2.2,
      stringProp: "zero",
      arrayProp: ["zero", "level"],
      objectProp: {
        firstLevelInt: 1,
        firstLevelMap: {
          secondLevelArray: ["second", "level"],
          secondLevelMap: {
            thirdLevelString: "third level",
            thirdLevelMap: {
              fourthLevelInt: 4,
              fourthLevelMap: {
                fifthLevelString: "fifth level"
              }
            }
          }
        }
      }
    }
  },
  output: {
    postgres: {
      sample_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map_fo: 4
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map_fo: "int"
        }
      },
      cloud_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "string"
        }
      },
      json_key_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: '["zero","level"]',
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map:
            '{"thirdLevelString":"third level","thirdLevelMap":{"fourthLevelInt":4}}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "json",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map: "json"
        }
      },
      json_key_cloud_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "json"
        }
      },
      cloud_json_key_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: '["zero","level"]',
          object_prop_first_level_int: 1,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4,"fourthLevelMap":{"fifthLevelString":"fifth level"}}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "json",
          object_prop_first_level_int: "int",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "string"
        }
      },
      escape_event: {
        output: {
          _as: '"escaped column"',
          _between: '"escaped column"',
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map_fo: 4
        },
        columnTypes: {
          _as: "json",
          _between: "json",
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map_fo: "int"
        }
      },
      primitive_json_event: {
        output: {
          int_prop: 0,
          float_prop: "2.2",
          string_prop: '"zero"',
          date_prop: '"2022-01-01T00:00:00.000Z"',
          array_prop: ["zero", "level"],
          object_prop_first_level_int: "1",
          object_prop_first_level_bool: "true",
          object_prop_first_level_date_prop: "2022-01-01T01:01:01.111Z",
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_date_prop:
            '"2022-01-01T02:02:02.222Z"',
          object_prop_first_level_map_second_level_map_third_level_string:
            '"third level"',
          object_prop_first_level_map_second_level_map_third_level_map_fo: 4
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "json",
          string_prop: "json",
          array_prop: "string",
          date_prop: "json",
          object_prop_first_level_int: "json",
          object_prop_first_level_bool: "json",
          object_prop_first_level_date_prop: "datetime",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_date_prop: "json",
          object_prop_first_level_map_second_level_map_third_level_string:
            "json",
          object_prop_first_level_map_second_level_map_third_level_map_fo: "int"
        }
      }
    },
    rs: {
      sample_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int: 4
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int:
            "int"
        }
      },
      cloud_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "string"
        }
      },
      json_key_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: '["zero","level"]',
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map:
            '{"thirdLevelString":"third level","thirdLevelMap":{"fourthLevelInt":4}}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "json",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map: "json"
        }
      },
      json_key_cloud_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "json"
        }
      },
      cloud_json_key_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: '["zero","level"]',
          object_prop_first_level_int: 1,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4,"fourthLevelMap":{"fifthLevelString":"fifth level"}}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "json",
          object_prop_first_level_int: "int",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "string"
        }
      },
      escape_event: {
        output: {
          _as: '"escaped column"',
          _between: '"escaped column"',
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int: 4
        },
        columnTypes: {
          _as: "json",
          _between: "json",
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int:
            "int"
        }
      },
      primitive_json_event: {
        output: {
          int_prop: 0,
          float_prop: "2.2",
          string_prop: '"zero"',
          array_prop: ["zero", "level"],
          date_prop: '"2022-01-01T00:00:00.000Z"',
          object_prop_first_level_int: "1",
          object_prop_first_level_bool: "true",
          object_prop_first_level_date_prop: "2022-01-01T01:01:01.111Z",
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_date_prop:
            '"2022-01-01T02:02:02.222Z"',
          object_prop_first_level_map_second_level_map_third_level_string:
            '"third level"',
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int: 4
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "json",
          string_prop: "json",
          array_prop: "string",
          date_prop: "json",
          object_prop_first_level_int: "json",
          object_prop_first_level_bool: "json",
          object_prop_first_level_date_prop: "datetime",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_date_prop: "json",
          object_prop_first_level_map_second_level_map_third_level_string:
            "json",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int:
            "int"
        }
      }
    },
    bq: {
      sample_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int: 4
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int:
            "int"
        }
      },
      cloud_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "string"
        }
      },
      json_key_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: '["zero","level"]',
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map:
            '{"thirdLevelString":"third level","thirdLevelMap":{"fourthLevelInt":4}}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map: "string"
        }
      },
      json_key_cloud_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "string"
        }
      },
      cloud_json_key_event: {
        output: {
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: '["zero","level"]',
          object_prop_first_level_int: 1,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map:
            '{"fourthLevelInt":4,"fourthLevelMap":{"fifthLevelString":"fifth level"}}'
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map: "string"
        }
      },
      escape_event: {
        output: {
          _as: '"escaped column"',
          _between: '"escaped column"',
          int_prop: 0,
          float_prop: 2.2,
          string_prop: "zero",
          array_prop: ["zero", "level"],
          object_prop_first_level_int: 1,
          object_prop_first_level_bool: true,
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_map_third_level_string:
            "third level",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int: 4
        },
        columnTypes: {
          _as: "string",
          _between: "string",
          int_prop: "int",
          float_prop: "float",
          string_prop: "string",
          array_prop: "string",
          object_prop_first_level_int: "int",
          object_prop_first_level_bool: "boolean",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int:
            "int"
        }
      },
      primitive_json_event: {
        output: {
          int_prop: 0,
          float_prop: "2.2",
          string_prop: '"zero"',
          array_prop: ["zero", "level"],
          date_prop: '"2022-01-01T00:00:00.000Z"',
          object_prop_first_level_int: "1",
          object_prop_first_level_bool: "true",
          object_prop_first_level_date_prop: "2022-01-01T01:01:01.111Z",
          object_prop_first_level_map_second_level_array: ["second", "level"],
          object_prop_first_level_map_second_level_date_prop:
            '"2022-01-01T02:02:02.222Z"',
          object_prop_first_level_map_second_level_map_third_level_string:
            '"third level"',
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int: 4
        },
        columnTypes: {
          int_prop: "int",
          float_prop: "string",
          string_prop: "string",
          array_prop: "string",
          date_prop: "string",
          object_prop_first_level_int: "string",
          object_prop_first_level_bool: "string",
          object_prop_first_level_date_prop: "datetime",
          object_prop_first_level_map_second_level_array: "string",
          object_prop_first_level_map_second_level_date_prop: "string",
          object_prop_first_level_map_second_level_map_third_level_string:
            "string",
          object_prop_first_level_map_second_level_map_third_level_map_fourth_level_int:
            "int"
        }
      }
    }
  }
};

function fInput(inputType) {
  return _.cloneDeep(sampleEvents.input[inputType]);
}

function fOutput(outputType, provider) {
  switch (provider) {
    case "postgres":
      return _.cloneDeep(sampleEvents.output.postgres[outputType]);
    case "rs":
      return _.cloneDeep(sampleEvents.output.rs[outputType]);
    case "bq":
      return _.cloneDeep(sampleEvents.output.bq[outputType]);
    default:
      return {};
  }
}

module.exports = { fInput, fOutput };
