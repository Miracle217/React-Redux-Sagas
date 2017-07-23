import { instagramAuthCallback, twitterAuthCallback } from 'app/routes';

export const getInstagramCallback = (context) => {
  const loc = window.location;
  return `${loc.protocol}//${loc.host}${instagramAuthCallback}?action=${context}`;
};

export const getTwitterCallback = (context) => {
  const loc = window.location;
  return `${loc.protocol}//${loc.host}${twitterAuthCallback}?action=${context}`;
};
