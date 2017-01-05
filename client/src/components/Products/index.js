import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

import './style.css';

export default class Products extends Component {

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('Products', className)} {...props}>

          <div className="ui vertical stripe segment">
              <div className="ui container">

                  <h1 class="ui header">All products</h1>

                  <table className="ui celled selectable table">
                      <thead>
                          <tr>
                              <th>Product name</th>
                              <th className="three wide">Type</th>
                              <th className="three wide">Amount</th>
                              <th className="three wide">Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Cinnamon Roast</td>
                              <td>Roast</td>
                              <td>2,000</td>
                              <td className="positive"><i className="icon checkmark"></i> In stock</td>
                          </tr>

                          <tr>
                              <td>New England Roast</td>
                              <td>Roast</td>
                              <td>0</td>
                              <td className="negative"><i className="icon close"></i> Sold out</td>
                          </tr>
                      </tbody>
                      <tfoot>
                          <tr>
                              <th>2 products</th>
                              <th></th>
                              <th></th>
                              <th>1 Sold out</th>
                          </tr>
                      </tfoot>
                  </table>

              </div>
          </div>
      </div>
    );
  }
}
