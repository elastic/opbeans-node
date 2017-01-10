import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';

import DashboardProductsList from '../DashboardProductsList';
import DashboardStatsList from '../DashboardStatsList';
import * as productActions from '../../actions/productActions';
import * as statsActions from '../../actions/statsActions';

import './style.css';

class Dashboard extends Component {

  componentDidMount() {
      this.props.actions.loadProductsTop();
      this.props.actions.loadStats();
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('Dashboard', className)}>

          <div className="ui vertical stripe segment">
              <div className="ui middle aligned stackable grid container">
                  <div className="row">
                      <div className="sixteen wide column">
                          <h1 className="ui header">OpBeans Dashboard</h1>
                          <div className="ui hidden divider"></div>
                          <p>The Sales & Inventory Management System for <a href="/">OpBeans Coffee Distribution Inc.</a><br/>Manage products, orders and customers and keep an eye on sales and stock levels.</p>
                      </div>
                  </div>
                  <div className="ui divider"></div>
                  <div className="row">
                      <div className="eight wide column">
                          <DashboardProductsList productsTop={this.props.productsTop} />
                      </div>
                      <div className="eight wide column">
                          <DashboardStatsList stats={this.props.stats}/>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
    productsTop: PropTypes.object.isRequired,
    stats: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    // Sort products by 'sold'
    state.productsTop.items.sort((a, b) => {
        return b.sold - a.sold;
    });

    return {
        productsTop: state.productsTop,
        stats: state.stats
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(Object.assign({}, productActions, statsActions), dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
