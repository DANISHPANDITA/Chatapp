import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import db from "./firebase";
import "./SideBarChat.css";
function SideBarChat({ addNewChat, id, Name }) {
  const [img, setimg] = useState("");
  const [messages, setmessages] = useState("");
  const createChat = () => {
    const name = prompt("New Name");
    if (name) {
      db.collection("Chats").add({
        Name: name,
      });
    }
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }));
  const classes = useStyles();
  useEffect(() => {
    if (id) {
      db.collection("Chats")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setmessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  useEffect(() => {
    setimg(Math.floor(Math.random() * 2000));
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return !addNewChat ? (
    <Link to={`/chats/${id}`}>
      <div className="sidebarchat">
        <Avatar
          className={classes.small}
          src={`https://avatars.dicebear.com/api/male/${img}.svg?mood[]=happy`}
          alt=""
        />
        <div className="chatinfo">
          <h3>{Name}</h3>
          <h4>{truncate(messages[0]?.message, 4)}</h4>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="createChat">
      <h2>Add New Chat Room</h2>
    </div>
  );
}

export default SideBarChat;
