import React from 'react';
import { ORIGIN_URL} from '../../app/routes';
import { stripeAppId } from 'config';

export const StripeLink = ({callback, accountKey, ...props}) => {
  const stripeUrl = `https://connect.stripe.com/oauth/authorize?redirect_uri=${encodeURIComponent(ORIGIN_URL)}${encodeURIComponent(callback)}&response_type=code&client_id=${stripeAppId}&scope=read_write&state=${accountKey}`;
  return (
    <a href={stripeUrl} {...props}>connect to stripe</a>
  );
};

export default StripeLink;
