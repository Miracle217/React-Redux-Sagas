import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { dashboard } from 'app/routes';
import LoginForm from '../common/LoginForm';
import WelcomeBody  from '../common/WelcomeBody';

const LandingPage = ({user}) => user && user.id ? null : <LoginForm />;

export default connect(state => ({
  user: state.user
}))(LandingPage);
