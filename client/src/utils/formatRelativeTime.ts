const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;

export const formatRelativeTime = (timestamp: number): string => {
  if (!timestamp) {
    return '';
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const diffInSeconds = Math.max(0, nowInSeconds - timestamp);

  if (diffInSeconds < MINUTE_IN_SECONDS) {
    return 'now';
  }

  if (diffInSeconds < HOUR_IN_SECONDS) {
    return `${Math.floor(diffInSeconds / MINUTE_IN_SECONDS)}m ago`;
  }

  if (diffInSeconds < DAY_IN_SECONDS) {
    return `${Math.floor(diffInSeconds / HOUR_IN_SECONDS)}h ago`;
  }

  return `${Math.floor(diffInSeconds / DAY_IN_SECONDS)}d ago`;
};
