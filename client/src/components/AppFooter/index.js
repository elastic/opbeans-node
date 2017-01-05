import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

class AppFooter extends Component {
    
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('AppFooter', className)} {...props}>
          <div className="ui inverted vertical footer segment">
              <div className="ui container">
                  <div className="ui stackable inverted divided equal height stackable grid">
                      <div className="three wide column">
                          <div className="ui inverted link list">
                              <a href="#" className="item disabled">Users</a>
                              <a href="#" className="item disabled">Settings</a>
                              <a href="#" className="item disabled">Log out</a>
                          </div>
                      </div>
                      <div className="seven wide column">
                          <h4 className="ui inverted header">Note</h4>
                          <p>This is just a demo application made by <a href="https://opbeat.com">Opbeat</a></p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}

export default AppFooter;
