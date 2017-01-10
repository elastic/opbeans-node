import React, {PropTypes} from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

import CustomersList from '../CustomersList';

const ProductDetail = ({product, productCustomers, getCustomers}) => {
  return (
      <div>
          { product.loading && (
              <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
              </div>
          )}
          <div className="ui middle aligned stackable grid container">
              <div className="row">
                  <div className="ten wide column">
                      <div className="ui segments">
                          <div className="ui secondary segment">Product overview</div>
                          <div className="ui segment">
                              <h3 className="ui sub header">
                                  Name
                              </h3>
                              <h1 className="">{product.product.name}</h1>
                          </div>
                          <div className="ui horizontal segments">
                              <div className="ui segment">
                                  <h3 className="ui sub header">
                                      Type
                                  </h3>
                                  <Link className='ui blue basic label' to={`/products/${product.product.id}`}>
                                      <i className="icon tag"></i>
                                      {product.product.type_name}
                                  </Link>
                              </div>
                              <div className="ui segment">
                                  <h3 className="ui sub header">
                                      SKU
                                  </h3>
                                  <div className="ui">
                                      <code>{product.product.sku}</code>
                                  </div>
                              </div>
                          </div>
                          <div className="ui segment">
                              <h3 className="ui sub header">
                                  Description
                              </h3>
                              <p className="ui text padded">{product.product.description}</p>
                          </div>
                      </div>
                      <div className="ui segments">
                          <div className="ui secondary segment">Product status</div>

                          <div className="ui horizontal segments">
                              <div className="ui segment">
                                  <h3 className="ui sub header">
                                      Stock
                                  </h3>
                                  <span>{product.product.stock}</span>
                              </div>
                              <div className="ui segment">
                                  <h3 className="ui sub header">
                                      Sold
                                  </h3>
                                  <span>{product.product.sold}</span>
                              </div>
                          </div>

                          <div className="ui horizontal segments">
                              <div className="ui segment">
                                  <h3 className="ui sub header">
                                      Cost
                                  </h3>
                                  <span>{ formatMoney(product.product.cost) }</span>
                              </div>
                              <div className="ui segment">
                                  <h3 className="ui sub header">
                                      Selling price
                                  </h3>
                                  <span>{ formatMoney(product.product.selling_price) }</span>
                              </div>
                          </div>

                      </div>
                  </div>
                  <div className="six wide column">
                      <div className="ui segments">
                          <div className="ui secondary segment">Product photo</div>
                          <div className="ui segment">
                              <img src={`/images/products/${product.product.sku}.jpg`} alt={`${product.product.name}`} title={`Photo of ${product.product.name}`} />
                          </div>
                      </div>
                  </div>
              </div>
              <div className="row">
                  <div className="sixteen wide column">
                      <div className="ui segments ProductCustomersList">
                          <div className="ui segment clearing secondary">
                              Customers who bought this product
                          </div>
                          <ProductCustomers productCustomers={ productCustomers } getCustomers={ getCustomers }/>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

function ProductCustomers({productCustomers, getCustomers}) {
    productCustomers.items = removeDuplicates(productCustomers.items, 'id');
    let items = productCustomers.items;

    if(items && items.length > 0) {
        return (
            <CustomersList customers={ productCustomers } />
        )
    } else {
        let buttonClass = classnames({
            'ui blue button': true,
            'loading': productCustomers.loading
        });
        return (
            <div className="ui segment clearing">
                <button
                    className={ buttonClass }
                    onClick={ getCustomers }
                    >
                    <i className="icon users"></i>
                    Get customer list
                </button>
            </div>
        )
    }
}
ProductCustomers.displayName = 'ProductCustomers';

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

function formatMoney(cents){
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductDetail;
