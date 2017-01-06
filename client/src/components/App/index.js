import React, { Component } from 'react';
import classnames from 'classnames';

import './style.css';

import AppHeader from '../AppHeader';
import AppFooter from '../AppFooter';

class App extends Component {

  render() {
    const { className } = this.props;
    return (
      <div className={classnames('App', className)}>
          <div className="pusher">

              <AppHeader />

              {this.props.children}

              <AppFooter />
          </div>
      </div>
    );
  }
}

export default App;
