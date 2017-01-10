import React, {PropTypes} from 'react';
import { Link } from 'react-router';

import moment from 'moment';

const OrdersList = ({orders}) => {

  let total_orders = orders.items.length;

  return (
      <div className="ui basic segment table-wrapper">
          { orders.loading && (
              <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
              </div>
          )}
          <table className="ui celled selectable table">
              <thead>
                  <tr>
                      <th>Customer name</th>
                      <th className="two wide">Order No.</th>
                      <th className="three wide">Date</th>
                  </tr>
              </thead>
              <tbody>

                  {orders.items.map(order =>
                      <tr key={order.id}>
                          <td>
                              <Link to={`/orders/${order.id}`}>{order.customer_name}</Link>
                          </td>
                          <td>#{order.id}</td>
                          <td>{moment(order.created_at).format('LLL')}</td>
                      </tr>
                  )}

              </tbody>
              <tfoot>
                  <tr>
                      <th>{ total_orders } orders</th>
                      <th></th>
                      <th></th>
                  </tr>
              </tfoot>
          </table>
      </div>
  );
};

OrdersList.propTypes = {
  orders: PropTypes.object.isRequired
};

export default OrdersList;
