import React, { useState } from 'react';
import CreateLink from './CreateLink';
import Header from './Header';
import LinkList from './LinkList';
import Login from './Login';
import { Switch, Route } from 'react-router-dom';

const App = () => {

  const [loggedIn, setLoggedIn] = useState(false)
  
  const onLoginClick = () => {
    setLoggedIn(true)
  }

  const onLogoutClick = () => {
    setLoggedIn(false)
  }

  return (
    <div className="center w85">
      <Header onLogoutClick={onLogoutClick}/>
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/">
            <LinkList />
          </Route>
          <Route path="/create">
            <CreateLink />
          </Route>
          <Route path="/login">
            <Login onLoginClick={onLoginClick}/>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;