import React from "react";
import "./App.css";
import SideBar from "./SideBar";
import Body from "./Body";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import { Helmet } from "react-helmet";

function App() {
  const [{ user }, dispatch] = useStateValue();
  return (
    <div className="app">
      <React.Fragment>
        <Helmet>
          <title>ChatUp!</title>
          <meta name="title" content="Chatup!-A RoomChat App!!" />
        </Helmet>

        {!user ? (
          <Login />
        ) : (
          <div className="appContainer">
            <Router>
              <Switch>
                <Route path="/chats/:chatid">
                  <SideBar name={user?.displayName} img={user?.photoURL} />
                  <Body />
                </Route>
                <Route path="/">
                  <SideBar name={user.displayName} img={user.photoURL} />
                  <Body />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
      </React.Fragment>
    </div>
  );
}

export default App;
