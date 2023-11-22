const {
  EXTERNAL_ID,
  TOKEN,
  CONTENT_TYPE,
  DEST_OBJECT,
  DEST_DEFINITION,
  MESSAGE_SOURCES_CONTEXT,
  DEST_CONFIG,
} = require('./constants');

const recordInputs = [
  {
    destination: DEST_OBJECT,
    message: {
      type: 'record',
      action: 'insert',
      fields: {
        id: 1001,
      },
      channel: 'sources',
      context: {
        sources: MESSAGE_SOURCES_CONTEXT,
        externalId: [
          {
            type: EXTERNAL_ID,
            id: 'id001',
          },
        ],
        destinationFields: 'id',
        mappedToDestination: 'true',
      },
      recordId: '3',
    },
    metadata: {
      jobId: 1,
    },
  },
  {
    destination: DEST_OBJECT,
    message: {
      type: 'record',
      action: 'insert',
      fields: {
        id: 1002,
      },
      channel: 'sources',
      context: {
        sources: MESSAGE_SOURCES_CONTEXT,
        externalId: [
          {
            type: EXTERNAL_ID,
            id: 'id002',
          },
        ],
        destinationFields: 'id',
        mappedToDestination: 'true',
      },
      recordId: '3',
    },
    metadata: {
      jobId: 2,
    },
  },
  {
    destination: DEST_OBJECT,
    message: {
      type: 'record',
      action: 'insert',
      fields: {
        id: 1003,
      },
      channel: 'sources',
      context: {
        sources: MESSAGE_SOURCES_CONTEXT,
        externalId: [
          {
            type: EXTERNAL_ID,
            id: 'id001',
          },
        ],
        destinationFields: 'id',
        mappedToDestination: 'true',
      },
      recordId: '3',
    },
    metadata: {
      jobId: 3,
    },
  },
  {
    destination: DEST_OBJECT,
    message: {
      action: 'delete',
      context: {
        destinationFields: 'id',
        externalId: [
          {
            id: 'id002',
            type: EXTERNAL_ID,
          },
        ],
        mappedToDestination: 'true',
        sources: {
          job_id: 'sf',
          job_run_id: 'ck985bve58cvnti48120',
          task_run_id: 'ck985bve58cvnti4812g',
          version: '',
        },
      },
      recordId: '2',
      rudderId: '2',
      fields: {
        id: '2001',
      },
      type: 'record',
    },
    metadata: {
      jobId: 4,
    },
  },
];

const recordOutput = [
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/id001/leads.json?id=1001&id=1003',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 1,
      },
      {
        jobId: 3,
      },
    ],
    batched: true,
    statusCode: 200,
    destination: DEST_OBJECT,
  },
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'DELETE',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/id002/leads.json?id=2001',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 4,
      },
    ],
    batched: true,
    statusCode: 200,
    destination: DEST_OBJECT,
  },
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/id002/leads.json?id=1002',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 2,
      },
    ],
    batched: true,
    statusCode: 200,
    destination: DEST_OBJECT,
  },
];

const audiencelistInputs = [
  {
    destination: {
      ID: '1zia9wKshXt80YksLmUdJnr7IHI',
      Name: 'test_marketo',
      DestinationDefinition: DEST_DEFINITION,
      Config: DEST_CONFIG,
      Enabled: true,
      Transformations: [],
      IsProcessorEnabled: true,
    },
    message: {
      userId: 'user 1',
      anonymousId: 'anon-id-new',
      event: 'event1',
      type: 'audiencelist',
      properties: {
        listData: {
          add: [
            {
              id: 501,
            },
            {
              id: 502,
            },
            {
              id: 503,
            },
          ],
          remove: [
            {
              id: 704,
            },
            {
              id: 705,
            },
            {
              id: 706,
            },
          ],
        },
        enablePartialFailure: true,
      },
      context: {
        library: {
          name: 'http',
        },
      },
      timestamp: '2020-02-02T00:23:09.544Z',
    },
    metadata: {
      jobId: 1,
    },
  },
  {
    destination: {
      ID: '1zia9wKshXt80YksLmUdJnr7IHI',
      Name: 'test_marketo',
      DestinationDefinition: DEST_DEFINITION,
      Config: DEST_CONFIG,
      Enabled: true,
      Transformations: [],
      IsProcessorEnabled: true,
    },
    message: {
      userId: 'user 1',
      anonymousId: 'anon-id-new',
      event: 'event1',
      type: 'audiencelist',
      properties: {
        listData: {
          add: [
            {
              id: 0,
            },
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 3,
            },
            {
              id: 4,
            },
            {
              id: 5,
            },
            {
              id: 6,
            },
            {
              id: 7,
            },
            {
              id: 8,
            },
            {
              id: 9,
            },
            {
              id: 10,
            },
            {
              id: 11,
            },
            {
              id: 12,
            },
            {
              id: 13,
            },
            {
              id: 14,
            },
            {
              id: 15,
            },
            {
              id: 16,
            },
            {
              id: 17,
            },
            {
              id: 18,
            },
            {
              id: 19,
            },
            {
              id: 20,
            },
            {
              id: 21,
            },
            {
              id: 22,
            },
            {
              id: 23,
            },
            {
              id: 24,
            },
            {
              id: 25,
            },
            {
              id: 26,
            },
            {
              id: 27,
            },
            {
              id: 28,
            },
            {
              id: 29,
            },
            {
              id: 30,
            },
            {
              id: 31,
            },
            {
              id: 32,
            },
            {
              id: 33,
            },
            {
              id: 34,
            },
            {
              id: 35,
            },
            {
              id: 36,
            },
            {
              id: 37,
            },
            {
              id: 38,
            },
            {
              id: 39,
            },
            {
              id: 40,
            },
            {
              id: 41,
            },
            {
              id: 42,
            },
            {
              id: 43,
            },
            {
              id: 44,
            },
            {
              id: 45,
            },
            {
              id: 46,
            },
            {
              id: 47,
            },
            {
              id: 48,
            },
            {
              id: 49,
            },
            {
              id: 50,
            },
            {
              id: 51,
            },
            {
              id: 52,
            },
            {
              id: 53,
            },
            {
              id: 54,
            },
            {
              id: 55,
            },
            {
              id: 56,
            },
            {
              id: 57,
            },
            {
              id: 58,
            },
            {
              id: 59,
            },
            {
              id: 60,
            },
            {
              id: 61,
            },
            {
              id: 62,
            },
            {
              id: 63,
            },
            {
              id: 64,
            },
            {
              id: 65,
            },
            {
              id: 66,
            },
            {
              id: 67,
            },
            {
              id: 68,
            },
            {
              id: 69,
            },
            {
              id: 70,
            },
            {
              id: 71,
            },
            {
              id: 72,
            },
            {
              id: 73,
            },
            {
              id: 74,
            },
            {
              id: 75,
            },
            {
              id: 76,
            },
            {
              id: 77,
            },
            {
              id: 78,
            },
            {
              id: 79,
            },
            {
              id: 80,
            },
            {
              id: 81,
            },
            {
              id: 82,
            },
            {
              id: 83,
            },
            {
              id: 84,
            },
            {
              id: 85,
            },
            {
              id: 86,
            },
            {
              id: 87,
            },
            {
              id: 88,
            },
            {
              id: 89,
            },
            {
              id: 90,
            },
            {
              id: 91,
            },
            {
              id: 92,
            },
            {
              id: 93,
            },
            {
              id: 94,
            },
            {
              id: 95,
            },
            {
              id: 96,
            },
            {
              id: 97,
            },
            {
              id: 98,
            },
            {
              id: 99,
            },
            {
              id: 100,
            },
            {
              id: 101,
            },
            {
              id: 102,
            },
            {
              id: 103,
            },
            {
              id: 104,
            },
            {
              id: 105,
            },
            {
              id: 106,
            },
            {
              id: 107,
            },
            {
              id: 108,
            },
            {
              id: 109,
            },
            {
              id: 110,
            },
            {
              id: 111,
            },
            {
              id: 112,
            },
            {
              id: 113,
            },
            {
              id: 114,
            },
            {
              id: 115,
            },
            {
              id: 116,
            },
            {
              id: 117,
            },
            {
              id: 118,
            },
            {
              id: 119,
            },
            {
              id: 120,
            },
            {
              id: 121,
            },
            {
              id: 122,
            },
            {
              id: 123,
            },
            {
              id: 124,
            },
            {
              id: 125,
            },
            {
              id: 126,
            },
            {
              id: 127,
            },
            {
              id: 128,
            },
            {
              id: 129,
            },
            {
              id: 130,
            },
            {
              id: 131,
            },
            {
              id: 132,
            },
            {
              id: 133,
            },
            {
              id: 134,
            },
            {
              id: 135,
            },
            {
              id: 136,
            },
            {
              id: 137,
            },
            {
              id: 138,
            },
            {
              id: 139,
            },
            {
              id: 140,
            },
            {
              id: 141,
            },
            {
              id: 142,
            },
            {
              id: 143,
            },
            {
              id: 144,
            },
            {
              id: 145,
            },
            {
              id: 146,
            },
            {
              id: 147,
            },
            {
              id: 148,
            },
            {
              id: 149,
            },
            {
              id: 150,
            },
            {
              id: 151,
            },
            {
              id: 152,
            },
            {
              id: 153,
            },
            {
              id: 154,
            },
            {
              id: 155,
            },
            {
              id: 156,
            },
            {
              id: 157,
            },
            {
              id: 158,
            },
            {
              id: 159,
            },
            {
              id: 160,
            },
            {
              id: 161,
            },
            {
              id: 162,
            },
            {
              id: 163,
            },
            {
              id: 164,
            },
            {
              id: 165,
            },
            {
              id: 166,
            },
            {
              id: 167,
            },
            {
              id: 168,
            },
            {
              id: 169,
            },
            {
              id: 170,
            },
            {
              id: 171,
            },
            {
              id: 172,
            },
            {
              id: 173,
            },
            {
              id: 174,
            },
            {
              id: 175,
            },
            {
              id: 176,
            },
            {
              id: 177,
            },
            {
              id: 178,
            },
            {
              id: 179,
            },
            {
              id: 180,
            },
            {
              id: 181,
            },
            {
              id: 182,
            },
            {
              id: 183,
            },
            {
              id: 184,
            },
            {
              id: 185,
            },
            {
              id: 186,
            },
            {
              id: 187,
            },
            {
              id: 188,
            },
            {
              id: 189,
            },
            {
              id: 190,
            },
            {
              id: 191,
            },
            {
              id: 192,
            },
            {
              id: 193,
            },
            {
              id: 194,
            },
            {
              id: 195,
            },
            {
              id: 196,
            },
            {
              id: 197,
            },
            {
              id: 198,
            },
            {
              id: 199,
            },
            {
              id: 200,
            },
            {
              id: 201,
            },
            {
              id: 202,
            },
            {
              id: 203,
            },
            {
              id: 204,
            },
            {
              id: 205,
            },
            {
              id: 206,
            },
            {
              id: 207,
            },
            {
              id: 208,
            },
            {
              id: 209,
            },
            {
              id: 210,
            },
            {
              id: 211,
            },
            {
              id: 212,
            },
            {
              id: 213,
            },
            {
              id: 214,
            },
            {
              id: 215,
            },
            {
              id: 216,
            },
            {
              id: 217,
            },
            {
              id: 218,
            },
            {
              id: 219,
            },
            {
              id: 220,
            },
            {
              id: 221,
            },
            {
              id: 222,
            },
            {
              id: 223,
            },
            {
              id: 224,
            },
            {
              id: 225,
            },
            {
              id: 226,
            },
            {
              id: 227,
            },
            {
              id: 228,
            },
            {
              id: 229,
            },
            {
              id: 230,
            },
            {
              id: 231,
            },
            {
              id: 232,
            },
            {
              id: 233,
            },
            {
              id: 234,
            },
            {
              id: 235,
            },
            {
              id: 236,
            },
            {
              id: 237,
            },
            {
              id: 238,
            },
            {
              id: 239,
            },
            {
              id: 240,
            },
            {
              id: 241,
            },
            {
              id: 242,
            },
            {
              id: 243,
            },
            {
              id: 244,
            },
            {
              id: 245,
            },
            {
              id: 246,
            },
            {
              id: 247,
            },
            {
              id: 248,
            },
            {
              id: 249,
            },
            {
              id: 250,
            },
            {
              id: 251,
            },
            {
              id: 252,
            },
            {
              id: 253,
            },
            {
              id: 254,
            },
            {
              id: 255,
            },
            {
              id: 256,
            },
            {
              id: 257,
            },
            {
              id: 258,
            },
            {
              id: 259,
            },
            {
              id: 260,
            },
            {
              id: 261,
            },
            {
              id: 262,
            },
            {
              id: 263,
            },
            {
              id: 264,
            },
            {
              id: 265,
            },
            {
              id: 266,
            },
            {
              id: 267,
            },
            {
              id: 268,
            },
            {
              id: 269,
            },
            {
              id: 270,
            },
            {
              id: 271,
            },
            {
              id: 272,
            },
            {
              id: 273,
            },
            {
              id: 274,
            },
            {
              id: 275,
            },
            {
              id: 276,
            },
            {
              id: 277,
            },
            {
              id: 278,
            },
            {
              id: 279,
            },
            {
              id: 280,
            },
            {
              id: 281,
            },
            {
              id: 282,
            },
            {
              id: 283,
            },
            {
              id: 284,
            },
            {
              id: 285,
            },
            {
              id: 286,
            },
            {
              id: 287,
            },
            {
              id: 288,
            },
            {
              id: 289,
            },
            {
              id: 290,
            },
            {
              id: 291,
            },
            {
              id: 292,
            },
            {
              id: 293,
            },
            {
              id: 294,
            },
            {
              id: 295,
            },
            {
              id: 296,
            },
            {
              id: 297,
            },
            {
              id: 298,
            },
            {
              id: 299,
            },
            {
              id: 300,
            },
            {
              id: 301,
            },
            {
              id: 302,
            },
            {
              id: 303,
            },
            {
              id: 304,
            },
            {
              id: 305,
            },
            {
              id: 306,
            },
            {
              id: 307,
            },
            {
              id: 308,
            },
            {
              id: 309,
            },
            {
              id: 310,
            },
            {
              id: 311,
            },
            {
              id: 312,
            },
            {
              id: 313,
            },
            {
              id: 314,
            },
            {
              id: 315,
            },
            {
              id: 316,
            },
            {
              id: 317,
            },
            {
              id: 318,
            },
            {
              id: 319,
            },
            {
              id: 320,
            },
            {
              id: 321,
            },
            {
              id: 322,
            },
            {
              id: 323,
            },
            {
              id: 324,
            },
            {
              id: 325,
            },
            {
              id: 326,
            },
            {
              id: 327,
            },
            {
              id: 328,
            },
            {
              id: 329,
            },
            {
              id: 330,
            },
            {
              id: 331,
            },
            {
              id: 332,
            },
            {
              id: 333,
            },
            {
              id: 334,
            },
            {
              id: 335,
            },
            {
              id: 336,
            },
            {
              id: 337,
            },
            {
              id: 338,
            },
            {
              id: 339,
            },
            {
              id: 340,
            },
            {
              id: 341,
            },
            {
              id: 342,
            },
            {
              id: 343,
            },
            {
              id: 344,
            },
            {
              id: 345,
            },
            {
              id: 346,
            },
            {
              id: 347,
            },
            {
              id: 348,
            },
            {
              id: 349,
            },
            {
              id: 350,
            },
          ],
        },
        enablePartialFailure: true,
      },
      context: {
        library: {
          name: 'http',
        },
      },
      timestamp: '2020-02-02T00:23:09.544Z',
    },
    metadata: {
      jobId: 2,
    },
  },
];

const reqMetadata = {
  namespace: 'Unknown',
  cluster: 'Unknown',
  features: {},
};

const largeRecordOutput = [
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'DELETE',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=351&id=352&id=353&id=354&id=355&id=356&id=357&id=358&id=359&id=360&id=361&id=362&id=363&id=364&id=365&id=366&id=367&id=368&id=369&id=370&id=371&id=372&id=373&id=374&id=375&id=376&id=377&id=378&id=379&id=380&id=381&id=382&id=383&id=384&id=385&id=386&id=387&id=388&id=389&id=390&id=391&id=392&id=393&id=394&id=395&id=396&id=397&id=398&id=399&id=400&id=401&id=402&id=403&id=404&id=405&id=406&id=407&id=408&id=409&id=410&id=411&id=412&id=413&id=414&id=415&id=416&id=417&id=418&id=419&id=420&id=421&id=422&id=423&id=424&id=425&id=426&id=427&id=428&id=429&id=430&id=431&id=432&id=433&id=434&id=435&id=436&id=437&id=438&id=439&id=440&id=441&id=442&id=443&id=444&id=445&id=446&id=447&id=448&id=449&id=450',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 351,
      },
      {
        jobId: 352,
      },
      {
        jobId: 353,
      },
      {
        jobId: 354,
      },
      {
        jobId: 355,
      },
      {
        jobId: 356,
      },
      {
        jobId: 357,
      },
      {
        jobId: 358,
      },
      {
        jobId: 359,
      },
      {
        jobId: 360,
      },
      {
        jobId: 361,
      },
      {
        jobId: 362,
      },
      {
        jobId: 363,
      },
      {
        jobId: 364,
      },
      {
        jobId: 365,
      },
      {
        jobId: 366,
      },
      {
        jobId: 367,
      },
      {
        jobId: 368,
      },
      {
        jobId: 369,
      },
      {
        jobId: 370,
      },
      {
        jobId: 371,
      },
      {
        jobId: 372,
      },
      {
        jobId: 373,
      },
      {
        jobId: 374,
      },
      {
        jobId: 375,
      },
      {
        jobId: 376,
      },
      {
        jobId: 377,
      },
      {
        jobId: 378,
      },
      {
        jobId: 379,
      },
      {
        jobId: 380,
      },
      {
        jobId: 381,
      },
      {
        jobId: 382,
      },
      {
        jobId: 383,
      },
      {
        jobId: 384,
      },
      {
        jobId: 385,
      },
      {
        jobId: 386,
      },
      {
        jobId: 387,
      },
      {
        jobId: 388,
      },
      {
        jobId: 389,
      },
      {
        jobId: 390,
      },
      {
        jobId: 391,
      },
      {
        jobId: 392,
      },
      {
        jobId: 393,
      },
      {
        jobId: 394,
      },
      {
        jobId: 395,
      },
      {
        jobId: 396,
      },
      {
        jobId: 397,
      },
      {
        jobId: 398,
      },
      {
        jobId: 399,
      },
      {
        jobId: 400,
      },
      {
        jobId: 401,
      },
      {
        jobId: 402,
      },
      {
        jobId: 403,
      },
      {
        jobId: 404,
      },
      {
        jobId: 405,
      },
      {
        jobId: 406,
      },
      {
        jobId: 407,
      },
      {
        jobId: 408,
      },
      {
        jobId: 409,
      },
      {
        jobId: 410,
      },
      {
        jobId: 411,
      },
      {
        jobId: 412,
      },
      {
        jobId: 413,
      },
      {
        jobId: 414,
      },
      {
        jobId: 415,
      },
      {
        jobId: 416,
      },
      {
        jobId: 417,
      },
      {
        jobId: 418,
      },
      {
        jobId: 419,
      },
      {
        jobId: 420,
      },
      {
        jobId: 421,
      },
      {
        jobId: 422,
      },
      {
        jobId: 423,
      },
      {
        jobId: 424,
      },
      {
        jobId: 425,
      },
      {
        jobId: 426,
      },
      {
        jobId: 427,
      },
      {
        jobId: 428,
      },
      {
        jobId: 429,
      },
      {
        jobId: 430,
      },
      {
        jobId: 431,
      },
      {
        jobId: 432,
      },
      {
        jobId: 433,
      },
      {
        jobId: 434,
      },
      {
        jobId: 435,
      },
      {
        jobId: 436,
      },
      {
        jobId: 437,
      },
      {
        jobId: 438,
      },
      {
        jobId: 439,
      },
      {
        jobId: 440,
      },
      {
        jobId: 441,
      },
      {
        jobId: 442,
      },
      {
        jobId: 443,
      },
      {
        jobId: 444,
      },
      {
        jobId: 445,
      },
      {
        jobId: 446,
      },
      {
        jobId: 447,
      },
      {
        jobId: 448,
      },
      {
        jobId: 449,
      },
      {
        jobId: 450,
      },
    ],
    batched: true,
    statusCode: 200,
    destination: DEST_OBJECT,
  },
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=1&id=2&id=3&id=4&id=5&id=6&id=7&id=8&id=9&id=10&id=11&id=12&id=13&id=14&id=15&id=16&id=17&id=18&id=19&id=20&id=21&id=22&id=23&id=24&id=25&id=26&id=27&id=28&id=29&id=30&id=31&id=32&id=33&id=34&id=35&id=36&id=37&id=38&id=39&id=40&id=41&id=42&id=43&id=44&id=45&id=46&id=47&id=48&id=49&id=50&id=51&id=52&id=53&id=54&id=55&id=56&id=57&id=58&id=59&id=60&id=61&id=62&id=63&id=64&id=65&id=66&id=67&id=68&id=69&id=70&id=71&id=72&id=73&id=74&id=75&id=76&id=77&id=78&id=79&id=80&id=81&id=82&id=83&id=84&id=85&id=86&id=87&id=88&id=89&id=90&id=91&id=92&id=93&id=94&id=95&id=96&id=97&id=98&id=99&id=100&id=101&id=102&id=103&id=104&id=105&id=106&id=107&id=108&id=109&id=110&id=111&id=112&id=113&id=114&id=115&id=116&id=117&id=118&id=119&id=120&id=121&id=122&id=123&id=124&id=125&id=126&id=127&id=128&id=129&id=130&id=131&id=132&id=133&id=134&id=135&id=136&id=137&id=138&id=139&id=140&id=141&id=142&id=143&id=144&id=145&id=146&id=147&id=148&id=149&id=150&id=151&id=152&id=153&id=154&id=155&id=156&id=157&id=158&id=159&id=160&id=161&id=162&id=163&id=164&id=165&id=166&id=167&id=168&id=169&id=170&id=171&id=172&id=173&id=174&id=175&id=176&id=177&id=178&id=179&id=180&id=181&id=182&id=183&id=184&id=185&id=186&id=187&id=188&id=189&id=190&id=191&id=192&id=193&id=194&id=195&id=196&id=197&id=198&id=199&id=200&id=201&id=202&id=203&id=204&id=205&id=206&id=207&id=208&id=209&id=210&id=211&id=212&id=213&id=214&id=215&id=216&id=217&id=218&id=219&id=220&id=221&id=222&id=223&id=224&id=225&id=226&id=227&id=228&id=229&id=230&id=231&id=232&id=233&id=234&id=235&id=236&id=237&id=238&id=239&id=240&id=241&id=242&id=243&id=244&id=245&id=246&id=247&id=248&id=249&id=250&id=251&id=252&id=253&id=254&id=255&id=256&id=257&id=258&id=259&id=260&id=261&id=262&id=263&id=264&id=265&id=266&id=267&id=268&id=269&id=270&id=271&id=272&id=273&id=274&id=275&id=276&id=277&id=278&id=279&id=280&id=281&id=282&id=283&id=284&id=285&id=286&id=287&id=288&id=289&id=290&id=291&id=292&id=293&id=294&id=295&id=296&id=297&id=298&id=299&id=300',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=301&id=302&id=303&id=304&id=305&id=306&id=307&id=308&id=309&id=310&id=311&id=312&id=313&id=314&id=315&id=316&id=317&id=318&id=319&id=320&id=321&id=322&id=323&id=324&id=325&id=326&id=327&id=328&id=329&id=330&id=331&id=332&id=333&id=334&id=335&id=336&id=337&id=338&id=339&id=340&id=341&id=342&id=343&id=344&id=345&id=346&id=347&id=348&id=349&id=350',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 1,
      },
      {
        jobId: 2,
      },
      {
        jobId: 3,
      },
      {
        jobId: 4,
      },
      {
        jobId: 5,
      },
      {
        jobId: 6,
      },
      {
        jobId: 7,
      },
      {
        jobId: 8,
      },
      {
        jobId: 9,
      },
      {
        jobId: 10,
      },
      {
        jobId: 11,
      },
      {
        jobId: 12,
      },
      {
        jobId: 13,
      },
      {
        jobId: 14,
      },
      {
        jobId: 15,
      },
      {
        jobId: 16,
      },
      {
        jobId: 17,
      },
      {
        jobId: 18,
      },
      {
        jobId: 19,
      },
      {
        jobId: 20,
      },
      {
        jobId: 21,
      },
      {
        jobId: 22,
      },
      {
        jobId: 23,
      },
      {
        jobId: 24,
      },
      {
        jobId: 25,
      },
      {
        jobId: 26,
      },
      {
        jobId: 27,
      },
      {
        jobId: 28,
      },
      {
        jobId: 29,
      },
      {
        jobId: 30,
      },
      {
        jobId: 31,
      },
      {
        jobId: 32,
      },
      {
        jobId: 33,
      },
      {
        jobId: 34,
      },
      {
        jobId: 35,
      },
      {
        jobId: 36,
      },
      {
        jobId: 37,
      },
      {
        jobId: 38,
      },
      {
        jobId: 39,
      },
      {
        jobId: 40,
      },
      {
        jobId: 41,
      },
      {
        jobId: 42,
      },
      {
        jobId: 43,
      },
      {
        jobId: 44,
      },
      {
        jobId: 45,
      },
      {
        jobId: 46,
      },
      {
        jobId: 47,
      },
      {
        jobId: 48,
      },
      {
        jobId: 49,
      },
      {
        jobId: 50,
      },
      {
        jobId: 51,
      },
      {
        jobId: 52,
      },
      {
        jobId: 53,
      },
      {
        jobId: 54,
      },
      {
        jobId: 55,
      },
      {
        jobId: 56,
      },
      {
        jobId: 57,
      },
      {
        jobId: 58,
      },
      {
        jobId: 59,
      },
      {
        jobId: 60,
      },
      {
        jobId: 61,
      },
      {
        jobId: 62,
      },
      {
        jobId: 63,
      },
      {
        jobId: 64,
      },
      {
        jobId: 65,
      },
      {
        jobId: 66,
      },
      {
        jobId: 67,
      },
      {
        jobId: 68,
      },
      {
        jobId: 69,
      },
      {
        jobId: 70,
      },
      {
        jobId: 71,
      },
      {
        jobId: 72,
      },
      {
        jobId: 73,
      },
      {
        jobId: 74,
      },
      {
        jobId: 75,
      },
      {
        jobId: 76,
      },
      {
        jobId: 77,
      },
      {
        jobId: 78,
      },
      {
        jobId: 79,
      },
      {
        jobId: 80,
      },
      {
        jobId: 81,
      },
      {
        jobId: 82,
      },
      {
        jobId: 83,
      },
      {
        jobId: 84,
      },
      {
        jobId: 85,
      },
      {
        jobId: 86,
      },
      {
        jobId: 87,
      },
      {
        jobId: 88,
      },
      {
        jobId: 89,
      },
      {
        jobId: 90,
      },
      {
        jobId: 91,
      },
      {
        jobId: 92,
      },
      {
        jobId: 93,
      },
      {
        jobId: 94,
      },
      {
        jobId: 95,
      },
      {
        jobId: 96,
      },
      {
        jobId: 97,
      },
      {
        jobId: 98,
      },
      {
        jobId: 99,
      },
      {
        jobId: 100,
      },
      {
        jobId: 101,
      },
      {
        jobId: 102,
      },
      {
        jobId: 103,
      },
      {
        jobId: 104,
      },
      {
        jobId: 105,
      },
      {
        jobId: 106,
      },
      {
        jobId: 107,
      },
      {
        jobId: 108,
      },
      {
        jobId: 109,
      },
      {
        jobId: 110,
      },
      {
        jobId: 111,
      },
      {
        jobId: 112,
      },
      {
        jobId: 113,
      },
      {
        jobId: 114,
      },
      {
        jobId: 115,
      },
      {
        jobId: 116,
      },
      {
        jobId: 117,
      },
      {
        jobId: 118,
      },
      {
        jobId: 119,
      },
      {
        jobId: 120,
      },
      {
        jobId: 121,
      },
      {
        jobId: 122,
      },
      {
        jobId: 123,
      },
      {
        jobId: 124,
      },
      {
        jobId: 125,
      },
      {
        jobId: 126,
      },
      {
        jobId: 127,
      },
      {
        jobId: 128,
      },
      {
        jobId: 129,
      },
      {
        jobId: 130,
      },
      {
        jobId: 131,
      },
      {
        jobId: 132,
      },
      {
        jobId: 133,
      },
      {
        jobId: 134,
      },
      {
        jobId: 135,
      },
      {
        jobId: 136,
      },
      {
        jobId: 137,
      },
      {
        jobId: 138,
      },
      {
        jobId: 139,
      },
      {
        jobId: 140,
      },
      {
        jobId: 141,
      },
      {
        jobId: 142,
      },
      {
        jobId: 143,
      },
      {
        jobId: 144,
      },
      {
        jobId: 145,
      },
      {
        jobId: 146,
      },
      {
        jobId: 147,
      },
      {
        jobId: 148,
      },
      {
        jobId: 149,
      },
      {
        jobId: 150,
      },
      {
        jobId: 151,
      },
      {
        jobId: 152,
      },
      {
        jobId: 153,
      },
      {
        jobId: 154,
      },
      {
        jobId: 155,
      },
      {
        jobId: 156,
      },
      {
        jobId: 157,
      },
      {
        jobId: 158,
      },
      {
        jobId: 159,
      },
      {
        jobId: 160,
      },
      {
        jobId: 161,
      },
      {
        jobId: 162,
      },
      {
        jobId: 163,
      },
      {
        jobId: 164,
      },
      {
        jobId: 165,
      },
      {
        jobId: 166,
      },
      {
        jobId: 167,
      },
      {
        jobId: 168,
      },
      {
        jobId: 169,
      },
      {
        jobId: 170,
      },
      {
        jobId: 171,
      },
      {
        jobId: 172,
      },
      {
        jobId: 173,
      },
      {
        jobId: 174,
      },
      {
        jobId: 175,
      },
      {
        jobId: 176,
      },
      {
        jobId: 177,
      },
      {
        jobId: 178,
      },
      {
        jobId: 179,
      },
      {
        jobId: 180,
      },
      {
        jobId: 181,
      },
      {
        jobId: 182,
      },
      {
        jobId: 183,
      },
      {
        jobId: 184,
      },
      {
        jobId: 185,
      },
      {
        jobId: 186,
      },
      {
        jobId: 187,
      },
      {
        jobId: 188,
      },
      {
        jobId: 189,
      },
      {
        jobId: 190,
      },
      {
        jobId: 191,
      },
      {
        jobId: 192,
      },
      {
        jobId: 193,
      },
      {
        jobId: 194,
      },
      {
        jobId: 195,
      },
      {
        jobId: 196,
      },
      {
        jobId: 197,
      },
      {
        jobId: 198,
      },
      {
        jobId: 199,
      },
      {
        jobId: 200,
      },
      {
        jobId: 201,
      },
      {
        jobId: 202,
      },
      {
        jobId: 203,
      },
      {
        jobId: 204,
      },
      {
        jobId: 205,
      },
      {
        jobId: 206,
      },
      {
        jobId: 207,
      },
      {
        jobId: 208,
      },
      {
        jobId: 209,
      },
      {
        jobId: 210,
      },
      {
        jobId: 211,
      },
      {
        jobId: 212,
      },
      {
        jobId: 213,
      },
      {
        jobId: 214,
      },
      {
        jobId: 215,
      },
      {
        jobId: 216,
      },
      {
        jobId: 217,
      },
      {
        jobId: 218,
      },
      {
        jobId: 219,
      },
      {
        jobId: 220,
      },
      {
        jobId: 221,
      },
      {
        jobId: 222,
      },
      {
        jobId: 223,
      },
      {
        jobId: 224,
      },
      {
        jobId: 225,
      },
      {
        jobId: 226,
      },
      {
        jobId: 227,
      },
      {
        jobId: 228,
      },
      {
        jobId: 229,
      },
      {
        jobId: 230,
      },
      {
        jobId: 231,
      },
      {
        jobId: 232,
      },
      {
        jobId: 233,
      },
      {
        jobId: 234,
      },
      {
        jobId: 235,
      },
      {
        jobId: 236,
      },
      {
        jobId: 237,
      },
      {
        jobId: 238,
      },
      {
        jobId: 239,
      },
      {
        jobId: 240,
      },
      {
        jobId: 241,
      },
      {
        jobId: 242,
      },
      {
        jobId: 243,
      },
      {
        jobId: 244,
      },
      {
        jobId: 245,
      },
      {
        jobId: 246,
      },
      {
        jobId: 247,
      },
      {
        jobId: 248,
      },
      {
        jobId: 249,
      },
      {
        jobId: 250,
      },
      {
        jobId: 251,
      },
      {
        jobId: 252,
      },
      {
        jobId: 253,
      },
      {
        jobId: 254,
      },
      {
        jobId: 255,
      },
      {
        jobId: 256,
      },
      {
        jobId: 257,
      },
      {
        jobId: 258,
      },
      {
        jobId: 259,
      },
      {
        jobId: 260,
      },
      {
        jobId: 261,
      },
      {
        jobId: 262,
      },
      {
        jobId: 263,
      },
      {
        jobId: 264,
      },
      {
        jobId: 265,
      },
      {
        jobId: 266,
      },
      {
        jobId: 267,
      },
      {
        jobId: 268,
      },
      {
        jobId: 269,
      },
      {
        jobId: 270,
      },
      {
        jobId: 271,
      },
      {
        jobId: 272,
      },
      {
        jobId: 273,
      },
      {
        jobId: 274,
      },
      {
        jobId: 275,
      },
      {
        jobId: 276,
      },
      {
        jobId: 277,
      },
      {
        jobId: 278,
      },
      {
        jobId: 279,
      },
      {
        jobId: 280,
      },
      {
        jobId: 281,
      },
      {
        jobId: 282,
      },
      {
        jobId: 283,
      },
      {
        jobId: 284,
      },
      {
        jobId: 285,
      },
      {
        jobId: 286,
      },
      {
        jobId: 287,
      },
      {
        jobId: 288,
      },
      {
        jobId: 289,
      },
      {
        jobId: 290,
      },
      {
        jobId: 291,
      },
      {
        jobId: 292,
      },
      {
        jobId: 293,
      },
      {
        jobId: 294,
      },
      {
        jobId: 295,
      },
      {
        jobId: 296,
      },
      {
        jobId: 297,
      },
      {
        jobId: 298,
      },
      {
        jobId: 299,
      },
      {
        jobId: 300,
      },
      {
        jobId: 301,
      },
      {
        jobId: 302,
      },
      {
        jobId: 303,
      },
      {
        jobId: 304,
      },
      {
        jobId: 305,
      },
      {
        jobId: 306,
      },
      {
        jobId: 307,
      },
      {
        jobId: 308,
      },
      {
        jobId: 309,
      },
      {
        jobId: 310,
      },
      {
        jobId: 311,
      },
      {
        jobId: 312,
      },
      {
        jobId: 313,
      },
      {
        jobId: 314,
      },
      {
        jobId: 315,
      },
      {
        jobId: 316,
      },
      {
        jobId: 317,
      },
      {
        jobId: 318,
      },
      {
        jobId: 319,
      },
      {
        jobId: 320,
      },
      {
        jobId: 321,
      },
      {
        jobId: 322,
      },
      {
        jobId: 323,
      },
      {
        jobId: 324,
      },
      {
        jobId: 325,
      },
      {
        jobId: 326,
      },
      {
        jobId: 327,
      },
      {
        jobId: 328,
      },
      {
        jobId: 329,
      },
      {
        jobId: 330,
      },
      {
        jobId: 331,
      },
      {
        jobId: 332,
      },
      {
        jobId: 333,
      },
      {
        jobId: 334,
      },
      {
        jobId: 335,
      },
      {
        jobId: 336,
      },
      {
        jobId: 337,
      },
      {
        jobId: 338,
      },
      {
        jobId: 339,
      },
      {
        jobId: 340,
      },
      {
        jobId: 341,
      },
      {
        jobId: 342,
      },
      {
        jobId: 343,
      },
      {
        jobId: 344,
      },
      {
        jobId: 345,
      },
      {
        jobId: 346,
      },
      {
        jobId: 347,
      },
      {
        jobId: 348,
      },
      {
        jobId: 349,
      },
      {
        jobId: 350,
      },
    ],
    batched: true,
    statusCode: 200,
    destination: DEST_OBJECT,
  },
];

const mixedBatchOutput = [
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'DELETE',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=911&id=912&id=913&id=914&id=915&id=916&id=917&id=918&id=919&id=920',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 911,
      },
      {
        jobId: 912,
      },
      {
        jobId: 913,
      },
      {
        jobId: 914,
      },
      {
        jobId: 915,
      },
      {
        jobId: 916,
      },
      {
        jobId: 917,
      },
      {
        jobId: 918,
      },
      {
        jobId: 919,
      },
      {
        jobId: 920,
      },
    ],
    batched: true,
    statusCode: 200,
    destination: DEST_OBJECT,
  },
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=901&id=902&id=903&id=904&id=905&id=906&id=907&id=908&id=909&id=910',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 901,
      },
      {
        jobId: 902,
      },
      {
        jobId: 903,
      },
      {
        jobId: 904,
      },
      {
        jobId: 905,
      },
      {
        jobId: 906,
      },
      {
        jobId: 907,
      },
      {
        jobId: 908,
      },
      {
        jobId: 909,
      },
      {
        jobId: 910,
      },
    ],
    batched: true,
    statusCode: 200,
    destination: DEST_OBJECT,
  },
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'DELETE',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=704&id=705&id=706',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=501&id=502&id=503',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 1,
      },
    ],
    batched: false,
    statusCode: 200,
    destination: {
      ID: '1zia9wKshXt80YksLmUdJnr7IHI',
      Name: 'test_marketo',
      DestinationDefinition: DEST_DEFINITION,
      Config: DEST_CONFIG,
      Enabled: true,
      Transformations: [],
      IsProcessorEnabled: true,
    },
  },
  {
    batchedRequest: [
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=0&id=1&id=2&id=3&id=4&id=5&id=6&id=7&id=8&id=9&id=10&id=11&id=12&id=13&id=14&id=15&id=16&id=17&id=18&id=19&id=20&id=21&id=22&id=23&id=24&id=25&id=26&id=27&id=28&id=29&id=30&id=31&id=32&id=33&id=34&id=35&id=36&id=37&id=38&id=39&id=40&id=41&id=42&id=43&id=44&id=45&id=46&id=47&id=48&id=49&id=50&id=51&id=52&id=53&id=54&id=55&id=56&id=57&id=58&id=59&id=60&id=61&id=62&id=63&id=64&id=65&id=66&id=67&id=68&id=69&id=70&id=71&id=72&id=73&id=74&id=75&id=76&id=77&id=78&id=79&id=80&id=81&id=82&id=83&id=84&id=85&id=86&id=87&id=88&id=89&id=90&id=91&id=92&id=93&id=94&id=95&id=96&id=97&id=98&id=99&id=100&id=101&id=102&id=103&id=104&id=105&id=106&id=107&id=108&id=109&id=110&id=111&id=112&id=113&id=114&id=115&id=116&id=117&id=118&id=119&id=120&id=121&id=122&id=123&id=124&id=125&id=126&id=127&id=128&id=129&id=130&id=131&id=132&id=133&id=134&id=135&id=136&id=137&id=138&id=139&id=140&id=141&id=142&id=143&id=144&id=145&id=146&id=147&id=148&id=149&id=150&id=151&id=152&id=153&id=154&id=155&id=156&id=157&id=158&id=159&id=160&id=161&id=162&id=163&id=164&id=165&id=166&id=167&id=168&id=169&id=170&id=171&id=172&id=173&id=174&id=175&id=176&id=177&id=178&id=179&id=180&id=181&id=182&id=183&id=184&id=185&id=186&id=187&id=188&id=189&id=190&id=191&id=192&id=193&id=194&id=195&id=196&id=197&id=198&id=199&id=200&id=201&id=202&id=203&id=204&id=205&id=206&id=207&id=208&id=209&id=210&id=211&id=212&id=213&id=214&id=215&id=216&id=217&id=218&id=219&id=220&id=221&id=222&id=223&id=224&id=225&id=226&id=227&id=228&id=229&id=230&id=231&id=232&id=233&id=234&id=235&id=236&id=237&id=238&id=239&id=240&id=241&id=242&id=243&id=244&id=245&id=246&id=247&id=248&id=249&id=250&id=251&id=252&id=253&id=254&id=255&id=256&id=257&id=258&id=259&id=260&id=261&id=262&id=263&id=264&id=265&id=266&id=267&id=268&id=269&id=270&id=271&id=272&id=273&id=274&id=275&id=276&id=277&id=278&id=279&id=280&id=281&id=282&id=283&id=284&id=285&id=286&id=287&id=288&id=289&id=290&id=291&id=292&id=293&id=294&id=295&id=296&id=297&id=298&id=299',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
      {
        version: '1',
        type: 'REST',
        method: 'POST',
        endpoint:
          'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=300&id=301&id=302&id=303&id=304&id=305&id=306&id=307&id=308&id=309&id=310&id=311&id=312&id=313&id=314&id=315&id=316&id=317&id=318&id=319&id=320&id=321&id=322&id=323&id=324&id=325&id=326&id=327&id=328&id=329&id=330&id=331&id=332&id=333&id=334&id=335&id=336&id=337&id=338&id=339&id=340&id=341&id=342&id=343&id=344&id=345&id=346&id=347&id=348&id=349&id=350',
        headers: {
          Authorization: TOKEN,
          'Content-Type': CONTENT_TYPE,
        },
        params: {},
        body: {
          JSON: {},
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        files: {},
      },
    ],
    metadata: [
      {
        jobId: 2,
      },
    ],
    batched: false,
    statusCode: 200,
    destination: {
      ID: '1zia9wKshXt80YksLmUdJnr7IHI',
      Name: 'test_marketo',
      DestinationDefinition: DEST_DEFINITION,
      Config: DEST_CONFIG,
      Enabled: true,
      Transformations: [],
      IsProcessorEnabled: true,
    },
  },
];

const recordEventGenerator = (id, action, externalId) => {
  // this function is used to generate record events for testing
  const testRecordEvent = {
    destination: {
      ID: '1zwa1wKshSt81YksKmUdJnr4IOK',
      Name: 'test_marketo_rc',
      DestinationDefinition: DEST_DEFINITION,
      Config: {
        clientId: 'marketo_client_id_success',
        clientSecret: 'marketo_client_secret_success',
        accountId: 'marketo_acct_id_success',
        staticListId: 1122,
      },
      Enabled: true,
      Transformations: [],
      IsProcessorEnabled: true,
    },
    message: {
      type: 'record',
      action,
      fields: {
        id,
      },
      channel: 'sources',
      context: {
        sources: MESSAGE_SOURCES_CONTEXT,
        externalId: [
          {
            type: EXTERNAL_ID,
            id: externalId,
          },
        ],
        destinationFields: 'id',
        mappedToDestination: 'true',
      },
      recordId: '3',
    },
    metadata: {
      jobId: id,
    },
  };
  return testRecordEvent;
};

module.exports = {
  recordInputs,
  audiencelistInputs,
  reqMetadata,
  recordOutput,
  largeRecordOutput,
  mixedBatchOutput,
  recordEventGenerator,
};
