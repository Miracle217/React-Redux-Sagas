'use strict';

import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { maybe } from 'helpers';
import { connect } from 'react-redux';

const Layout = ({children, nolayout, branding}) => {
  const navigation = nolayout ? null : <Navigation />;
  const footer = nolayout ? null : <Footer />;
  const brandingStyle = ((brandingColor) => brandingColor && (
    <style>{`
    .form-container a:not(.form-button), .legal-container a:not(.form-button),
    h1, h2, h3, h4, h5, h6,
    article a, article a:hover
    {
      color: ${brandingColor};
    }
    .form-button, .form-button:hover
    {
      background-color: ${brandingColor};
    }
    `}</style>
  ))(maybe(branding, 'account', 'primaryColor'));
  return (
    <div>
      {navigation}
      {children}
      {footer}
      {brandingStyle}
    </div>
  );
};

export default connect(state => ({
  nolayout: state.ui.nolayout,
  branding: state.ui.hashtagBranding
}))(Layout);
