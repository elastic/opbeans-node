import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

class AppHeader extends Component {

  render() {
    const { className, ...props } = this.props;
    return (
        <div className={classnames('AppHeader', className)} {...props}>
            <div className="ui large blue inverted menu">
                <div className="ui container">
                    <Link className="item" activeClassName="active" to="/dashboard">
                        <i className="dashboard icon"></i>
                        Dashboard
                    </Link>

                    <div className="menu right">
                        <Link className="item" activeClassName="active" to="/products">
                            <i className="coffee icon"></i>
                            Products
                        </Link>
                        <Link className="item" activeClassName="active" to="/orders">
                            <i className="cart icon"></i>
                            Orders
                        </Link>
                        <Link className="item" activeClassName="active" to="/customers">
                            <i className="users icon"></i>
                            Customers
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
  }
}

export default AppHeader;
