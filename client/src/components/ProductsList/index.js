import React, {PropTypes} from 'react';
import { Link } from 'react-router';

import { TableLoader, TableFiller } from '../TableLoader';

const ProductsList = ({products}) => {

  let total_products = products.items.length;
  let total_sold_out = products.items.reduce(function(n, product) {
    return n + (product.stock === 0);
  }, 0);

  return (
      <div className="ui basic segment table-wrapper">

          <TableLoader data={products} />

          <table className="ui celled selectable table">
              <thead>
                  <tr>
                      <th className="Photo-cell">
                          <i className="photo icon"></i>
                      </th>
                      <th>Name</th>
                      <th className="three wide">Type</th>
                      <th className="two wide">Stock</th>
                      <th className="two wide">Status</th>
                  </tr>
              </thead>
              <tbody>

                  <TableFiller data={products} />

                  {products.items.map(product =>
                      <tr key={product.id}>
                          <td className="Photo-cell">
                              <img src={`/images/products/${product.sku}.jpg`} alt={`${product.name}`} title={`Photo of ${product.name}`} />
                          </td>
                          <td>
                              <Link to={`/products/${product.id}`}>{product.name}</Link>
                          </td>
                          <td>{product.type_name}</td>
                          <td>{product.stock}</td>

                          { product.stock > 0 ? (
                            <td className="positive"><i className="icon checkmark"></i> In stock</td>
                          ) : (
                            <td className="negative"><i className="icon close"></i> Sold out</td>
                          )}
                      </tr>
                  )}

              </tbody>
              <tfoot>
                  <tr>
                      <th></th>
                      <th>{ total_products } products</th>
                      <th></th>
                      <th></th>
                      <th>{ total_sold_out } Sold out</th>
                  </tr>
              </tfoot>
          </table>
      </div>
  );
};

ProductsList.propTypes = {
  products: PropTypes.object.isRequired
};

export default ProductsList;
