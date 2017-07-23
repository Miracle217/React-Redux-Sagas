import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import SellerHelp from 'components/seller/SellerHelp';
import SellerAddProduct from 'components/seller/SellerAddProduct';
import SELLER from 'action-types/seller';
import buildAction from 'helpers/buildAction';
import Loading from '../common/Loading';
import { boostAdminUrl } from 'config';
import NotificationList from 'components/common/NotificationList';
import CopyToClipboard from 'react-copy-to-clipboard';


export class SellerConnectionsDashboard extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = { showTwitterMenu: false, showInstagramMenu: false, showProductPopUp: false, product:{}, copied: false };
    this.onTwitterConnect = this.onTwitterConnect.bind(this);
    this.onInstagramConnect = this.onInstagramConnect.bind(this);
    this.cancelConnectWithTwitter = this.cancelConnectWithTwitter.bind(this);
    this.cancelConnectWithInstagram = this.cancelConnectWithInstagram.bind(this);
    this.openTwitterPopup = this.openTwitterPopup.bind(this);
    this.productPopup = this.productPopup.bind(this);
  }

  cancelConnectWithTwitter () {
    this.setState({showTwitterMenu: false});
  }

  cancelConnectWithInstagram () {
    this.setState({showInstagramMenu: false});
  }

  onTwitterConnect (e) {
    e.preventDefault();

    const { dispatch } = this.props;
    dispatch(buildAction(SELLER.TWITTER_CONNECT));
  }

  onInstagramConnect (e) {
    e.preventDefault();

    const { dispatch } = this.props;
    dispatch(buildAction(SELLER.INSTAGRAM_CONNECT));
  }

  openTwitterPopup () {
    this.setState({showTwitterMenu: true});
  }
  productPopup () {
    this.props.dispatch(buildAction(SELLER.PRODUCT_POPUP, true));
  }

  render () {
    var showTwitterMenu = this.state.showTwitterMenu;
    var showInstagramMenu = this.state.showInstagramMenu;
    var showProductPopUp = this.props.productPopup;
    // mock the products and account
    var productListed = this.props.productListed;
    var accountPending = this.props.accountPending;

    const { dispatch } = this.props;

    const queryUrl = `${boostAdminUrl}?seller`;

    let twitterMenu =  (
      <div className="menu-overlay">
        <button className="form-button" onClick={this.onTwitterConnect}>connect with twitter</button>
        <a href="javascript:void(0)" onClick = {this.cancelConnectWithTwitter} >cancel</a>
      </div>
    );

    let instagramMenu =  (
      <div className="menu-overlay">
        <button className="form-button" onClick={this.onInstagramConnect}>connect with instagramMenu</button>
        <a href="javascript:void(0)" onClick={this.cancelConnectWithInstagram} >cancel</a>
      </div>
    );

    let twitterConnected = this.props.account.twitterAuth ? <div className="form-button button-success text-center" href="#"><i className="fa fa-check" /></div> : <a className="form-button" onClick={this.onTwitterConnect}>enable</a>;

    let instagramConnected = this.props.account.instagramAuth ? <div className="form-button button-success text-center" href="#"><i className="fa fa-check" /></div> : <a className="form-button" onClick={this.onInstagramConnect}>enable</a>;

    var productEmptyState =  (
      <div>
        <i className="large-icon fa fa-rocket" />
        <h2 className="text-center">add your first product</h2>
        <div>
          <p className="helper-text text-center">
            Get your first sale ready. Once we approve your account it will be live!
          </p>
          <button className="form-button" onClick={this.productPopup}>add product</button>
        </div>
      </div>
    );
    var productHashtag = `#${this.props.account.slug}001`;
    var productAdded =  (
      <div className="text-center">
        <img src={this.state.product.imageUrl}/>
        {accountPending ? <div><h6>almost there</h6>
        <p className="helper-text text-center">Account Pending</p></div> : <div><h6 className="success">your first campaign is live</h6>
        <h2>{productHashtag}</h2>
        <CopyToClipboard text={productHashtag}
          onCopy={() => this.setState({copied: true})}>
          <button className="form-button">copy to clipboard</button>
        </CopyToClipboard> </div>
      }
     </div>
    );

    var goToDashboard = (
      <div>
        <h6 className="text-left">administrate</h6>
        <div className="form-container">
          <div className="dashboard-section">
            <div className="dashboard-item row">
              <div className="small-12 medium-8 large-9 columns">
                <div className="flex">
                  <i className="large-icon fa fa-bar-chart-o" />
                  <div>
                    <h3>dashboard</h3>
                    <p className="helper-text">
                      Track your sales, add more products, manage users and more.
                    </p>
                  </div>
                </div>
              </div>
              <div className="small-12 medium-4 large-3 columns">
                <a className="form-button" href={queryUrl}>go</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    var key = this.props.key;
    return (
     <div key={key}>
     <NotificationList notifications={this.props.notifications} />
        {showProductPopUp ? <SellerAddProduct /> : null}
        <div className="header small">
          <div>
          <div className={classNames({'status-badge' : true, 'status-badge-success' : !accountPending })}>
            <i className={classNames({fa : true, 'fa-clock-o' : accountPending, 'fa-check' : !accountPending })} />
              <div className="status-readout">
                {accountPending ? 'account pending' : 'account activated!'}
              </div>
            </div>
          </div>
          <h1>
            {accountPending ? 'your account has been created' : 'you are ready to go!'}
          </h1>
        </div>
        <div className="row checkout-form dashboard">
        <Loading />
          <div className="small-12 medium-5 large-4 columns">
            <h6 className="text-left">products</h6>
            <div className="form-container">
              <div className="dashboard-section">
                {productListed ? productAdded : productEmptyState}
              </div>
              <div className="dashboard-section hidden">
                <div className="flex">
                  <div className="large-icon fa fa-link" />
                  <h2 className="text-left">integrate with eCommerce</h2>
                </div>
                {/*
                <p className="helper-text text-left">
                  Magento and Shopify copy explaining how easy it is to integrate with them.<br />
                  <a href="#">Learn More about eCommerce Integration</a>
                </p>
                */}
                <div className="row">
                  <div className="small-12 medium-6 columns">
                    <button className="form-button button-secondary">shopify</button>
                  </div>
                  <div className="small-12 medium-6 columns">
                    <button className="form-button button-secondary">magento</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="small-12 medium-7 large-8 columns">
            {accountPending ? '' : goToDashboard}
            <h6 className="text-left">enable social networks</h6>
            <div className="form-container">
              <div className="dashboard-section text-center">
                <div className="dashboard-item row">
                  <div className="small-12 medium-8 large-9 columns">
                    <div className="flex">
                      <i className="large-icon fa fa-mobile-phone" />
                      <div className="">
                        <h3>sms</h3>
                        <p className="helper-text">
                          Customers can text your hashtag to 81000. No configuration required!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="small-12 medium-4 large-3 columns">
                    <div className="form-button button-success text-center" href="#"><i className="fa fa-check" /></div>
                  </div>
                </div>
                <div className="dashboard-item row">
                  <div className="small-12 medium-8 large-9 columns">
                    <div className="flex">
                      <i className="large-icon fa fa-twitter" />
                      <div className="">
                        <h3>twitter</h3>
                        <p className="helper-text">
                          Anyone can buy with retweets and #mentions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="small-12 medium-4 large-3 columns">
                    {showTwitterMenu ? twitterMenu : twitterConnected}
                  </div>
                </div>
                <div className="dashboard-item row">
                  <div className="small-12 medium-8 large-9 columns">
                    <div className="flex">
                      <i className="large-icon fa fa-instagram" />
                      <div className="">
                        <h3>instagram</h3>
                        <p className="helper-text">
                          Followers can buy your products by commenting your #hashtag.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="small-12 medium-4 large-3 columns">
                    {showInstagramMenu ? instagramMenu : instagramConnected}
                  </div>
                </div>
              </div>
            </div>
            <SellerHelp />
          </div>
        </div>
      </div>
    );
  }
}

SellerConnectionsDashboard.defaultProps = {
  productListed: false,
  accountPending : true,
  paymentStep: 1
};

export default connect(state => ({
  notification: state.ui.notifications,
  account: state.seller.account,
  productPopup: state.seller.productPopup,
  productListed: state.seller.productListed,
  accountPending: state.seller.accountPending
}))(SellerConnectionsDashboard);
