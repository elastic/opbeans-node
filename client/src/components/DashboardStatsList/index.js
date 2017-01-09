import React, {PropTypes} from 'react';
import { Link } from 'react-router';

const DashboardStatsList = ({stats}) => {
    
  return (
      <div className="ui basic segment table-wrapper">
          <h2 className="ui header">Stats</h2>
          { stats.loading && (
              <div className="ui active inverted dimmer">
                  <div className="ui text loader">Loading</div>
              </div>
          )}
          <div className="ui segments">
              <div className="ui title segment">
                  Financials
              </div>

              <div className="ui horizontal segments">
                  <div className="ui segment">
                      <h3 className="ui sub header">
                          Revenue
                      </h3>
                      <span>{ formatMoney(stats.data.numbers.revenue) }</span>
                  </div>
                  <div className="ui segment">
                      <h3 className="ui sub header">
                          Cost
                      </h3>
                      <span>{ formatMoney(stats.data.numbers.cost) }</span>
                  </div>
                  <div className="ui segment">
                      <h3 className="ui sub header">
                          Profit
                      </h3>
                      <span>{ formatMoney(stats.data.numbers.profit) }</span>
                  </div>
              </div>

              <div className="ui title segment">
                  Totals
              </div>

              <div className="ui horizontal segments">
                  <div className="ui segment">
                      <h3 className="ui sub header">
                          <Link className="item" activeClassName="active" to="/products">
                              Products
                          </Link>
                      </h3>
                      <span>{stats.data.products}</span>
                  </div>
                  <div className="ui segment">
                      <h3 className="ui sub header">
                          <Link className="item" activeClassName="active" to="/customers">
                              Customers
                          </Link>
                      </h3>
                      <span>{stats.data.customers}</span>
                  </div>
                  <div className="ui segment">
                      <h3 className="ui sub header">
                          <Link className="item" activeClassName="active" to="/orders">
                              Orders
                          </Link>
                      </h3>
                      <span>{stats.data.orders}</span>
                  </div>
              </div>
          </div>
      </div>
  );
};

function formatMoney(cents){
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
}

DashboardStatsList.propTypes = {
  stats: PropTypes.object.isRequired
};

export default DashboardStatsList;
