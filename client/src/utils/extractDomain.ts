export const extractDomain = (url?: string | null): string => {
  if (!url) {
    return '';
  }

  return new URL(url).hostname.replace(/^www\./, '');
};
