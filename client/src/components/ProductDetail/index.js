import React, {PropTypes} from 'react';

const ProductDetail = ({product}) => {
  return (
      <div className="ui segments">
          <div className="ui secondary segment">Product overview</div>

              { product.loading && (
                  <div className="ui active inverted dimmer">
                      <div className="ui text loader">Loading</div>
                  </div>
              )}
          <div className="ui segment">
              <h3 className="ui sub header">
                  Name
              </h3>
              <h1 className="">{product.product.name}</h1>
          </div>

          <div className="ui horizontal segments">
              <div className="ui segment">
                  <h3 className="ui sub header">
                      SKU
                  </h3>
                  <div className="ui">
                      <code>{product.product.sku}</code>
                  </div>
              </div>
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Type
                  </h3>
                  <a className="ui blue basic label">
                      <i className="icon tag"></i>
                      {product.product.type_name}
                  </a>
              </div>
          </div>

          <div className="ui horizontal segments">
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Stock
                  </h3>
                  <span>{product.product.stock}</span>
              </div>
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

          <div className="ui horizontal segments">
              <div className="ui padded segment">
                  <h3 className="ui sub header">
                      Description
                  </h3>
                  <p className="ui text padded">{product.product.description}</p>
              </div>
          </div>

          <div className="ui segment clearing secondary">
              <button className="ui blue button right floated disabled">
                  <i className="icon users"></i>
                  Customers who bought this product
              </button>
          </div>
      </div>
  );
};

function formatMoney(cents){
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductDetail;
