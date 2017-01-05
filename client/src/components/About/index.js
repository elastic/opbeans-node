import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

import './style.css';

export default class About extends Component {

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('About', className)} {...props}>

          <div className="ui vertical stripe segment">
              <div className="ui middle aligned stackable grid container">
                  <div className="row">
                      <div className="eight wide column">
                          <h1 className="ui header">Welcome to OpBeans Admin</h1>
                          <p>The Sales & Inventory Management System for OpBeans Coffee Distribution Inc.</p>
                      </div>
                  </div>
              </div>
          </div>

      </div>
    );
  }
}
