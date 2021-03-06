/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from 'react';
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

import AdminLayout from "./layouts/Admin.jsx";
import Login from './views/login/Login.jsx';

import getConfig from './utils/getConfig'
const axios = require('axios').default

function App() {

  const { isAuthEnabled } = getConfig()

  const isLoggedIn = () => {
    if (!isAuthEnabled) {
      return true
    }
    if (!axios.defaults.withCredentials) {
      axios.defaults.withCredentials = true
    }
    const expAt = localStorage.getItem('JWT_COOKIE_EXP_AT')
    if (expAt) {
      const currentTime = Date.now() / 1000
      if (currentTime + 60 < +expAt) {
        setTimeout(() => handleLogout(), (expAt - 60 - currentTime) * 1000);
        return true
      } else {
        localStorage.clear()
      }
    } 
    return false
  }

  const [user, setUser] = useState(isLoggedIn());

  const handleLogin = (e, token) => {
    e.preventDefault()
    localStorage.setItem('JWT_COOKIE_EXP_AT', token.iat + token.maxAge)
    localStorage.setItem('JWT_COOKIE_DFSP_ID', token.dfspId)
    setUser(true)
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(false)
  }

  return (
    <Router>
        {
          isAuthEnabled
          ?
            user
            ?
            <Switch>
              <Route exact path='/login' render={props => <Login {...props} handleLogin={handleLogin} user={user} />} />
              <Route path="/admin" render={props => <AdminLayout {...props} handleLogout={handleLogout} />} />
              <Redirect from='/' to='/admin/index' />
            </Switch>
            :
            <Switch>
              <Route exact path='/login' render={props => <Login {...props} handleLogin={handleLogin} user={user} />} />
              <Redirect to='/login' />
            </Switch>
          :
          <Switch>
            <Route path="/admin" render={props => <AdminLayout {...props} handleLogout={handleLogout} />} />
            <Redirect from='/' to='/admin/index' />
          </Switch>
        }
    </Router>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById("root")
);
