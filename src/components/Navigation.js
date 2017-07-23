'use strict';
import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import buildAction from 'helpers/buildAction';
import { root, signup, dashboard, about, contact } from 'app/routes';
import { maybe } from 'helpers';
import UI from 'action-types/ui';
import USER from 'action-types/user';

const Navigation = ({branding, poweredBy, expandMenu, user, onMenuClick, onLogoutClick}) => {
  const loginLink = !user.id ? <li><Link to={root}>log in</Link></li> : null;
  const signupLink = !user.id ? <li><Link to={signup}>sign up</Link></li> : null;
  const logoutLink = user.id ? <li><a onClick={onLogoutClick} to={root}>log out</a></li> : null;
  const loggedOutRoot = 'https://boo.st';
  const logo =  <div className="logo"><img src={maybe(branding, 'account', 'logoUrl') || '/images/logo01.png'} className="header-circle"/><img src="/images/logo02.png" className={classNames({'header-tag': true, hide: !!maybe(branding, 'account', 'logoUrl')})}/></div>;
  const userRoot = !user.id ? <a href="https://boo.st">{logo}</a> : <Link to={root}>{logo}</Link>;

  const topbarClass = ['top-bar'].concat(expandMenu ? 'expanded' : null).join(' ');

  const brandingImage = maybe(branding, 'account', 'logoUrl');

  const navContent = !poweredBy ? (
    <ul className="right">{signupLink}{loginLink}{logoutLink}</ul>
  ) : (
    <div className="header-blurb">
      <span className="brand-title">{maybe(branding, 'account', 'name')}</span><br />
      powered by <a href="http://boo.st">Boost</a>.</div>
  );

  return (
    <div className="contain-to-grid top-nav-bar">
      <nav className={topbarClass} data-topbar role="navigation">
        <ul className="title-area">
          <li className="name">
            {userRoot}
          </li>
        </ul>
        <section className="top-bar-section">
          {navContent}
        </section>
      </nav>
    </div>
  );
};

export default connect(state => ({
  branding: state.ui.hashtagBranding,
  poweredBy: state.ui.poweredBy,
  expandMenu: state.ui.expandMenu,
  user: state.user
}), dispatch => ({
  onMenuClick: (e) => {
    e.preventDefault();
    dispatch(buildAction(UI.MENU_TOGGLE));
  },
  onLogoutClick: (e) => {
    e.preventDefault();
    dispatch(buildAction(USER.LOGOUT));
  }
})
)(Navigation);
