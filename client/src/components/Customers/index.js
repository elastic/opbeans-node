import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';

import './style.css';

import CustomersList from '../CustomersList';
import * as customerActions from '../../actions/customerActions';

class Customers extends Component {

    componentDidMount() {
        this.props.actions.loadCustomers();
    }

    render() {
        const { className } = this.props;
        return (
            <div className={classnames('Customers', className)}>
                <div className="ui vertical stripe segment">
                    <div className="ui container">
                        <h1 className="ui header">All customers</h1>
                        <CustomersList customers={this.props.customers} />
                    </div>
                </div>
            </div>
        );
    }
}

Customers.propTypes = {
    customers: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        customers: state.customers
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(customerActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
