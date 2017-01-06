import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';

import './style.css';

import CustomerDetail from '../CustomerDetail';
import * as customerActions from '../../actions/customerActions';

class Customer extends Component {

    componentDidMount() {
        this.props.actions.loadCustomer(this.props.params.id);
    }

    render() {
        const { className } = this.props;
        return (
            <div className={classnames('Customer', className)}>
                <div className="ui vertical stripe segment">
                    <div className="ui container">

                        <CustomerDetail customer={this.props.customer} />

                    </div>
                </div>
            </div>
        );
    }
}

Customer.propTypes = {
    customer: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        customer: state.customer
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(customerActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
