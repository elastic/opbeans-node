import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classnames from 'classnames';

import './style.css';

import ProductsList from '../ProductsList';
import * as productActions from '../../actions/productActions';

class Products extends Component {

    componentDidMount() {
        this.props.actions.loadProducts();
    }

    componentWillUnmount() {
        this.props.actions.unloadProducts();
    }

    render() {
        const { className } = this.props;
        return (
            <div className={classnames('Products', className)}>
                <div className="ui vertical stripe segment">
                    <div className="ui container">
                        <h1 className="ui header">All products</h1>
                        <ProductsList products={this.props.products} />
                    </div>
                </div>
            </div>
        );
    }
}

Products.propTypes = {
    products: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        products: state.products
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(productActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);
