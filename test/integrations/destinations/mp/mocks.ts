// The create deletion task handler waits on a real 1s timer between requests. Destinations that run
// earlier in the shared component suite switch Jest to fake timers (to pin the system time) and
// never switch back, and a fake timer does not fire on its own, so cases that exercise that wait
// switch real timers back on.
export const useRealTimers = () => {
  jest.useRealTimers();
};
