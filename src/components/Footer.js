import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { dashboard, privacy, contact, about } from 'app/routes';

const Footer = ({user}) => {
  const dashboardLink = user.id ? <li><Link to={dashboard}>Dashboard</Link></li> : null;
  const bbbLink = 'https://www.bbb.org/losangelessiliconvalley/business-reviews/online-payments/boost-in-beverly-hills-ca-643116#bbbseal';

  function getNortonBadge () {
    return {
      __html: global.getNortonBadge()
    };
  }

  const nortonStyle = {
    color: '#000000',
    font: 'bold 7px verdana,sans-serif',
    margin: '0px',
    padding:'0px',
    textDecoration: 'none',
    letterSpacing: '.5px',
    textAlign: 'center'
  };

  const nortonTable = {
    borderWidth: 0,
    width: '135px',
    cellSpacing: 2,
    cellPadding: 0
  };

  const norton = (
    <table className="centered" style={nortonTable} title="Click to Verify - This site chose Symantec SSL for secure e-commerce and confidential communications.">
      <tbody>
        <tr>
          <td style={{width:'135px', textAlign:'center', verticalAlign:'top'}}>
            {/* original script kept for posterity */}
            {/*<script type="text/javascript" src="https://seal.websecurity.norton.com/getseal?host_name=web.boo.st&amp;size=S&amp;use_flash=NO&amp;use_transparent=YES&amp;lang=en"></script><br />*/}
            <div dangerouslySetInnerHTML={getNortonBadge()} />
            <a href="http://www.symantec.com/ssl-certificates" target="_blank" style={nortonStyle}>ABOUT SSL CERTIFICATES</a>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <footer>
      <div className="row">
        <div className="medium-12 columns centered text-center">
          <ul>
            <li>{norton}</li>
            <br />
            <li><a className="bbbLogo" href={bbbLink} /></li>
            <br />
            <li><Link to={about}>about</Link></li>
            <li><Link to={privacy}>privacy</Link></li>
            <li><Link to={contact}>contact</Link></li>
              {dashboardLink}
          </ul>
          <br />
          <div className="row">
            <div className="medium-12 columns centered text-center">
              <div className="logo-circle">Boost</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
Footer.propTypes = {
  user: PropTypes.object.isRequired
};
export default connect(state => ({
  user: state.user
}))(Footer);
