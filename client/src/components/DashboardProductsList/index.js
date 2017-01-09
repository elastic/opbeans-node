import React, {PropTypes} from 'react';
import { Link } from 'react-router';

const DashboardProductsList = ({productsTop}) => {

  return (
      <div className="ui basic segment table-wrapper">
          <h2 className="ui header">Top selling products</h2>
          { productsTop.loading && (
              <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
              </div>
          )}
          <table className="ui celled selectable table">
              <thead>
                  <tr>
                      <th>Product name</th>
                      <th className="two wide">Sold</th>
                      <th className="two wide">Stock</th>
                      <th className="three wide">Status</th>
                  </tr>
              </thead>
              <tbody>
                  {productsTop.items.map(product =>
                      <tr key={product.id}>
                          <td>
                              <Link to={`/products/${product.id}`}>{product.name}</Link>
                          </td>
                          <td>{product.sold}</td>
                          <td>{product.stock}</td>

                          { product.stock > 0 ? (
                            <td className="positive"><i className="icon checkmark"></i> In stock</td>
                          ) : (
                            <td className="negative"><i className="icon close"></i> Sold out</td>
                          )}
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
  );
};

DashboardProductsList.propTypes = {
  productsTop: PropTypes.object.isRequired
};

export default DashboardProductsList;
