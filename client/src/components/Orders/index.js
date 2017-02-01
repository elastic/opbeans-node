import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';

import './style.css';

import OrdersList from '../OrdersList';
import * as orderActions from '../../actions/orderActions';

class Orders extends Component {

    componentDidMount() {
        this.props.actions.loadOrders();
    }

    componentWillUnmount() {
        this.props.actions.unloadOrders();
    }

    render() {
        const { className } = this.props;
        return (
            <div className={classnames('Orders', className)}>
                <div className="ui vertical stripe segment">
                    <div className="ui container">
                        <h1 className="ui header">All orders</h1>
                        <OrdersList orders={this.props.orders} />
                    </div>
                </div>
            </div>
        );
    }
}

Orders.propTypes = {
    orders: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        orders: state.orders
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(orderActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
