import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

class AppHeader extends Component {

  render() {
    const { className, ...props } = this.props;
    return (
        <div className={classnames('AppHeader', className)} {...props}>
            <div className="ui large menu">

                <Link className="item" activeClassName="active" to="/">
                    <i className="coffee icon"></i>
                    OpBeans Admin
                </Link>

                <div className="menu right">
                    <Link className="item" activeClassName="active" to="/products">
                        <i className="cart icon"></i>
                        Products
                    </Link>
                    <Link className="item disabled" activeClassName="active" to="">
                        <i className="line chart icon"></i>
                        Orders
                    </Link>
                    <Link className="item disabled" activeClassName="active" to="">
                        <i className="users icon"></i>
                        Customers
                    </Link>
                </div>

            </div>
        </div>
    );
  }
}

export default AppHeader;
