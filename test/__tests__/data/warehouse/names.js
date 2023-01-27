const names = {
  input: {
    properties: {
      omega: "test",
      "omega v2": "test",
      "9mega": "test",
      "mega&": "test",
      ome$ga: "test",
      alpha$: "test",
      "ome_ ga": "test",
      "9mega________-________90": "test",
      Cízǔ: "test",
      CamelCase123Key: "test",
      "1CComega": "test"
    }
  },
  output: {
    columns: {
      default: {
        omega: "string",
        omega_v_2: "string",
        _9_mega: "string",
        mega: "string",
        ome_ga: "string",
        alpha: "string",
        ome_ga: "string",
        _9_mega_90: "string",
        c_z: "string",
        camel_case_123_key: "string",
        _1_c_comega: "string"
      },
      snowflake: {
        OMEGA: "string",
        OMEGA_V_2: "string",
        _9_MEGA: "string",
        MEGA: "string",
        OME_GA: "string",
        ALPHA: "string",
        OME_GA: "string",
        _9_MEGA_90: "string",
        C_Z: "string",
        CAMEL_CASE_123_KEY: "string",
        _1_C_COMEGA: "string"
      }
    },
    data: {
      default: {
        omega: "test",
        omega_v_2: "test",
        _9_mega: "test",
        mega: "test",
        ome_ga: "test",
        alpha: "test",
        ome_ga: "test",
        _9_mega_90: "test",
        c_z: "test",
        camel_case_123_key: "test",
        _1_c_comega: "test"
      },
      snowflake: {
        OMEGA: "test",
        OMEGA_V_2: "test",
        _9_MEGA: "test",
        MEGA: "test",
        OME_GA: "test",
        ALPHA: "test",
        OME_GA: "test",
        _9_MEGA_90: "test",
        C_Z: "test",
        CAMEL_CASE_123_KEY: "test",
        _1_C_COMEGA: "test"
      }
    },
    namesMap: {
      default: {
        omega: "omega",
        "omega v2": "omega_v_2",
        "9mega": "_9_mega",
        "mega&": "mega",
        ome$ga: "ome_ga",
        alpha$: "alpha",
        "ome_ ga": "ome_ga",
        "9mega________-________90": "_9_mega_90",
        Cízǔ: "c_z",
        CamelCase123Key: "camel_case_123_key",
        "1CComega": "_1_c_comega"
      },
      snowflake: {
        omega: "OMEGA",
        "omega v2": "OMEGA_V_2",
        "9mega": "_9_MEGA",
        "mega&": "MEGA",
        ome$ga: "OME_GA",
        alpha$: "ALPHA",
        "ome_ ga": "OME_GA",
        "9mega________-________90": "_9_MEGA_90",
        Cízǔ: "C_Z",
        CamelCase123Key: "CAMEL_CASE_123_KEY",
        "1CComega": "_1_C_COMEGA"
      }
    }
  }
};

module.exports = { names };
