import React from 'react';
import { Link } from 'react-router';
import { history, dashboard } from 'app/routes';

export default ({ui, selected}) => {
  const DEFAULT_CLASSNAMES = 'nav-link';
  return (
    <div className="dash-nav">
      <div className={selected === 'history' ? `${DEFAULT_CLASSNAMES} active` :  DEFAULT_CLASSNAMES}>
        <Link to={history}>history</Link>
      </div>
      <div className={selected === 'account' ? `${DEFAULT_CLASSNAMES} active` :  DEFAULT_CLASSNAMES}>
        <Link to={dashboard}>account</Link>
      </div>
    </div>
  );
};
