import React, {PropTypes} from 'react';

const OrderDetail = ({order}) => {
  return (
      <div className="ui segments">
          <div className="ui secondary segment">Order overview</div>

              { order.loading && (
                  <div className="ui active inverted dimmer">
                      <div className="ui text loader">Loading</div>
                  </div>
              )}
          <div className="ui segment">
              <h3 className="ui sub header">
                  ORDER NO.
              </h3>
              <h1 className="">{order.order.id}</h1>
          </div>

          <div className="ui horizontal segments">
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Customer ID
                  </h3>
                  <div className="ui">
                      {order.order.customer_id}
                  </div>
              </div>
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Date
                  </h3>
                  {order.order.created_at}
              </div>
          </div>
      </div>
  );
};

OrderDetail.propTypes = {
  order: PropTypes.object.isRequired
};

export default OrderDetail;
