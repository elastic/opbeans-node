import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

import './style.css';

export default class NotFound extends Component {

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('NotFound', className)} {...props}>
          <div className="ui vertical stripe center aligned segment">
              <h1 className="ui icon header">
                <i className="warning sign icon"></i>
                <div className="content">
                  Page not found
                  <div className="sub header">Please try a different page.</div>
                </div>
            </h1>
          </div>
      </div>
    );
  }
}
