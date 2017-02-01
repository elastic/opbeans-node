import React, {PropTypes} from 'react';
import { Link } from 'react-router';

import { TableLoader, TableFiller } from '../TableLoader';

const CustomersList = ({customers}) => {

  let total_customers = customers.items.length;

  return (
      <div className="ui basic segment table-wrapper">
          <TableLoader data={customers} />

          <table className="ui celled selectable table">
              <thead>
                  <tr>
                      <th className="two wide">Customer No.</th>
                      <th>Customer name</th>
                      <th>Company name</th>
                      <th>Email</th>
                  </tr>
              </thead>
              <tbody>

                  <TableFiller data={customers} />

                  {customers.items.map(customer =>
                      <tr key={customer.id}>
                          <td>#{customer.id}</td>
                          <td>
                              <Link to={`/customers/${customer.id}`}>{customer.full_name}</Link>
                          </td>
                          <td>{customer.company_name}</td>
                          <td>{customer.email}</td>
                      </tr>
                  )}

              </tbody>
              <tfoot>
                  <tr>
                      <th>{ total_customers } customers</th>
                      <th></th>
                      <th></th>
                      <th></th>
                  </tr>
              </tfoot>
          </table>
      </div>
  );
};

CustomersList.propTypes = {
  customers: PropTypes.object.isRequired
};

export default CustomersList;
