import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { auth, googleAuth } from "./firebase";
import "./Login.css";
import Zoom from "react-reveal/Zoom";
import { useStateValue } from "./StateProvider";
import { actionType } from "./reducer";
function Login() {
  const [{}, dispatch] = useStateValue();
  const login = () => {
    auth
      .signInWithPopup(googleAuth)
      .then((res) => {
        dispatch({
          type: actionType.SET_USER,
          user: res.user,
        });
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        dispatch({
          //logged in
          type: "SET_USER",
          user: authuser,
        });
      } else {
        dispatch({
          //logged out
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, [dispatch]);
  return (
    <div className="login">
      <Zoom top>
        <h1>Chatup!</h1>
      </Zoom>
      <Zoom Bottom>
        <div className="login_container">
          <img
            src="https://images.pexels.com/photos/861126/pexels-photo-861126.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt=""
          />
          <div className="login_info">
            <h3>SIGN IN TO YOUR Chatup! ACCOUNT</h3>
            <Button onClick={login}>Sign in with your Google Account</Button>
          </div>
        </div>
      </Zoom>
    </div>
  );
}

export default Login;
