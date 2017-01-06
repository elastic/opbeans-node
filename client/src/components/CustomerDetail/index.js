import React, {PropTypes} from 'react';

const CustomerDetail = ({customer}) => {
  return (
      <div className="ui segments">
          <div className="ui secondary segment">Customer overview</div>

              { customer.loading && (
                  <div className="ui active inverted dimmer">
                      <div className="ui text loader">Loading</div>
                  </div>
              )}
          <div className="ui segment">
              <h3 className="ui sub header">
                  Name
              </h3>
              <h1 className="">{customer.customer.full_name}</h1>
          </div>

          <div className="ui horizontal segments">
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Company name
                  </h3>
                  <div className="ui">
                      {customer.customer.company_name}
                  </div>
              </div>
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Email
                  </h3>
                  <div className="ui">
                      {customer.customer.email}
                  </div>
              </div>
          </div>
          <div className="ui horizontal segments">
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Address
                  </h3>
                  {customer.customer.address}
              </div>
          </div>
          <div className="ui horizontal segments">
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Postal code & City
                  </h3>
                  {customer.customer.postal_code}, {customer.customer.city}
              </div>
              <div className="ui segment">
                  <h3 className="ui sub header">
                      Country
                  </h3>
                  {customer.customer.country}
              </div>
          </div>

      </div>
  );
};

CustomerDetail.propTypes = {
  customer: PropTypes.object.isRequired
};

export default CustomerDetail;
