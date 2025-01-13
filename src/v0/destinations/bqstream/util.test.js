const { getRearrangedEvents } = require('./util');

describe('getRearrangedEvents', () => {
  // Tests that the function returns an array of transformed events when there are no error events
  it('should return an array of transformed events when all events are track and successfully transformed', () => {
    const eachUserSuccessEventslist = [
      { message: { type: 'track' }, metadata: { jobId: 1 } },
      { message: { type: 'track' }, metadata: { jobId: 3 } },
      { message: { type: 'track' }, metadata: { jobId: 5 } },
    ];
    const eachUserErrorEventsList = [];
    const expected = [
      [
        { message: { type: 'track' }, metadata: [{ jobId: 1 }] },
        { message: { type: 'track' }, metadata: [{ jobId: 3 }] },
        { message: { type: 'track' }, metadata: [{ jobId: 5 }] },
      ],
    ];
    const result = getRearrangedEvents(eachUserSuccessEventslist, eachUserErrorEventsList);
    expect(result).toEqual(expected);
  });

  // Tests that the function returns an empty array when both input arrays are empty
  it('should return an empty array when both input arrays are empty', () => {
    const eachUserSuccessEventslist = [];
    const eachUserErrorEventsList = [];
    const expected = [[]];
    const result = getRearrangedEvents(eachUserSuccessEventslist, eachUserErrorEventsList);
    expect(result).toEqual(expected);
  });

  // Tests that the function returns an array with only error events when all events are erroneous
  it('should return an array with only error events when all events are erroneous', () => {
    const eachUserSuccessEventslist = [];
    const eachUserErrorEventsList = [
      {
        batched: false,
        destination: {},
        error: 'Message Type not supported: identify',
        metadata: [{ jobId: 3, userId: 'user12345' }],
      },
      {
        batched: false,
        destination: {},
        error: 'Message Type not supported: identify',
        metadata: [{ jobId: 4, userId: 'user12345' }],
      },
      {
        batched: false,
        destination: {},
        error: 'Invalid payload for the destination',
        metadata: [{ jobId: 5, userId: 'user12345' }],
      },
    ];
    const expected = [
      [
        {
          batched: false,
          destination: {},
          error: 'Message Type not supported: identify',
          metadata: [
            { jobId: 3, userId: 'user12345' },
            { jobId: 4, userId: 'user12345' },
          ],
        },
      ],
      [
        {
          batched: false,
          destination: {},
          error: 'Invalid payload for the destination',
          metadata: [
            {
              jobId: 5,
              userId: 'user12345',
            },
          ],
        },
      ],
    ];
    const result = getRearrangedEvents(eachUserSuccessEventslist, eachUserErrorEventsList);
    expect(result).toEqual(expected);
  });
  // Tests that the function does not return an ordered array of events with both successful and erroneous events
  it('case 1 : 1--> success, 2 --> fail, 3 --> success, 4 --> fail, 5 --> success', () => {
    const errorEventsList = [
      {
        batched: false,
        destination: {},
        error: 'Invalid payload for the destination',
        metadata: [{ jobId: 2, userId: 'user12345' }],
      },
      {
        batched: false,
        destination: {},
        error: 'Invalid payload for the destination',
        metadata: [{ jobId: 4, userId: 'user12345' }],
      },
    ];
    const successEventslist = [
      { message: { type: 'track' }, metadata: { jobId: 1 } },
      { message: { type: 'track' }, metadata: { jobId: 3 } },
      { message: { type: 'track' }, metadata: { jobId: 5 } },
    ];
    const expected = [
      [
        { message: { type: 'track' }, metadata: [{ jobId: 1 }] },
        { message: { type: 'track' }, metadata: [{ jobId: 3 }] },
        { message: { type: 'track' }, metadata: [{ jobId: 5 }] },
      ],
      [
        {
          batched: false,
          destination: {},
          error: 'Invalid payload for the destination',
          metadata: [
            { jobId: 2, userId: 'user12345' },
            { jobId: 4, userId: 'user12345' },
          ],
        },
      ],
    ];
    const result = getRearrangedEvents(successEventslist, errorEventsList);
    expect(result).toEqual(expected);
  });

  it('case 2 : 1--> success, 2 --> success, 3 --> fail, 4 --> fail, 5 --> success', () => {
    const errorEventsList = [
      {
        batched: false,
        destination: {},
        error: 'Invalid payload for the destination',
        metadata: [{ jobId: 3, userId: 'user12345' }],
      },
      {
        batched: false,
        destination: {},
        error: 'Invalid payload for the destination',
        metadata: [{ jobId: 4, userId: 'user12345' }],
      },
    ];
    const successEventslist = [
      { message: { type: 'track' }, metadata: { jobId: 1 } },
      { message: { type: 'track' }, metadata: { jobId: 2 } },
      { message: { type: 'track' }, metadata: { jobId: 5 } },
    ];
    const expected = [
      [
        {
          message: {
            type: 'track',
          },
          metadata: [
            {
              jobId: 1,
            },
          ],
        },
        {
          message: {
            type: 'track',
          },
          metadata: [
            {
              jobId: 2,
            },
          ],
        },
        {
          message: {
            type: 'track',
          },
          metadata: [
            {
              jobId: 5,
            },
          ],
        },
      ],
      [
        {
          batched: false,
          destination: {},
          error: 'Invalid payload for the destination',
          metadata: [
            {
              jobId: 3,
              userId: 'user12345',
            },
            {
              jobId: 4,
              userId: 'user12345',
            },
          ],
        },
      ],
    ];
    const result = getRearrangedEvents(successEventslist, errorEventsList);
    expect(result).toEqual(expected);
  });

  it('case 3 : 1--> fail, 2 --> success, 3 --> success, 4 --> fail', () => {
    const errorEventsList = [
      {
        batched: false,
        destination: {},
        error: 'Invalid payload for the destination',
        metadata: [{ jobId: 1, userId: 'user12345' }],
      },
      {
        batched: false,
        destination: {},
        error: 'Invalid payload for the destination',
        metadata: [{ jobId: 4, userId: 'user12345' }],
      },
    ];
    const successEventslist = [
      { message: { type: 'track' }, metadata: { jobId: 2 } },
      { message: { type: 'track' }, metadata: { jobId: 3 } },
    ];
    const expected = [
      [
        {
          message: {
            type: 'track',
          },
          metadata: [
            {
              jobId: 2,
            },
          ],
        },
        {
          message: {
            type: 'track',
          },
          metadata: [
            {
              jobId: 3,
            },
          ],
        },
      ],
      [
        {
          batched: false,
          destination: {},
          error: 'Invalid payload for the destination',
          metadata: [
            {
              jobId: 1,
              userId: 'user12345',
            },
            {
              jobId: 4,
              userId: 'user12345',
            },
          ],
        },
      ],
    ];
    const result = getRearrangedEvents(successEventslist, errorEventsList);
    expect(result).toEqual(expected);
  });
});
