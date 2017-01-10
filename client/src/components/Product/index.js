import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';

import './style.css';

import ProductDetail from '../ProductDetail';
import * as productActions from '../../actions/productActions';

class Product extends Component {

    componentDidMount() {
        this.props.actions.loadProduct(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.actions.resetProductCustomers();
    }

    getCustomers() {
        this.props.actions.loadProductCustomers(this.props.params.id);
    }

    render() {
        const { className } = this.props;
        return (
            <div className={classnames('Product', className)}>
                <div className="ui vertical stripe segment">
                    <div className="ui container">
                        <ProductDetail product={this.props.product} productCustomers={this.props.productCustomers} getCustomers={ this.getCustomers.bind(this) } />
                    </div>
                </div>
            </div>
        );
    }
}

Product.propTypes = {
    product: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        product: state.product,
        productCustomers: state.productCustomers
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(productActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
