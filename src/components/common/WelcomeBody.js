import React from 'react';
import { Link } from 'react-router';
import { dashboard } from 'app/routes';
import { connect } from 'react-redux';
import UI from 'action-types/ui';
import buildAction from 'helpers/buildAction';


const WelcomeBody = ({dispatch}) =>{

  const onClick = (event) => {
    const sref = event.target.getAttribute('data-ui-sref');
    dispatch(buildAction(UI.DASHBOARD_WRAPPER, sref));
  };

  return (
    <main>
      <div className="half-color-block" />
      <div className="row">
        <div className="top-block">
          <div className="medium-10 columns centered">
            <hr className="divider" />
            <h6>BUY WITH #&#39;s USING</h6>
            <Link to={dashboard} data-ui-sref="twitter" onClick={onClick} className="form-button twitter-button"><i className="fa fa-twitter" /> buy on twitter</Link>
            <br/>
            <Link to={dashboard} data-ui-sref="instagram" onClick={onClick} className="form-button instagram-button"><i className="fa fa-instagram" /> buy on instagram</Link>
            <br/>
            <Link to={dashboard} data-ui-sref="phone" onClick={onClick} className="form-button primary">just phone for now</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default connect()(WelcomeBody);
