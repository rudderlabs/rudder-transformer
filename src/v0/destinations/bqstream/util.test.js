const { getRearrangedEvents } = require('./util');

describe('getRearrangedEvents', () => {
  // Tests that the function returns an array of transformed events when there are no error events
  it('should return an array of transformed events when there are no error events', () => {
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
    ];
    const result = getRearrangedEvents(eachUserSuccessEventslist, eachUserErrorEventsList);
    expect(result).toEqual(expected);
  });

  // Tests that the function returns an ordered array of events with both successful and erroneous events, ordered based on the jobId property of the events' metadata array
  it('should return an ordered array of events with both successful and erroneous events', () => {
    const eachUserSuccessEventslist = [
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
    ];
    const eachUserErrorEventsList = [
      { message: { type: 'track' }, metadata: { jobId: 1 } },
      { message: { type: 'track' }, metadata: { jobId: 2 } },
      { message: { type: 'track' }, metadata: { jobId: 5 } },
    ];
    const expected = [
      [
        { message: { type: 'track' }, metadata: [{ jobId: 1 }] },
        { message: { type: 'track' }, metadata: [{ jobId: 2 }] },
      ],
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
      [{ message: { type: 'track' }, metadata: [{ jobId: 5 }] }],
    ];
    const result = getRearrangedEvents(eachUserSuccessEventslist, eachUserErrorEventsList);
    expect(result).toEqual(expected);
  });
});
