import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import db from "./firebase";
import "./SideBarChat.css";
import { DeleteOutlineTwoTone } from "@material-ui/icons";
import { useStateValue } from "./StateProvider";

function SideBarChat({ addNewChat, id, Name, admin }) {
  const [{ user }, dispatch] = useStateValue();
  const [img, setImg] = useState("");
  const [Names, setNames] = useState([]);

  const [messages, setmessages] = useState("");
  const { chatid } = useParams();
  useEffect(() => {
    db.collection("Chats").onSnapshot((snapshot) =>
      setNames(snapshot.docs.map((doc) => doc.Name))
    );
  });

  
  const createChat = () => {
    const name = prompt("Room Name");
    const id = prompt("Create an id");
    const admin = prompt("Admin Name");
    if (name) {
      if (Names.includes(name)) {
        alert("Similar Name Exists");
      } else {
        db.collection("Chats").add({
          id: id,
          Name: name,
          admin: admin,
        });
      }
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
    setImg(Math.floor(Math.random() * 2000));
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
          <div className="sidebarChatHeader">
            <h3>{Name}</h3>
            {admin === user.displayName && (
              <Tooltip title="Delete">
                <IconButton className="sidebarSettings">
                  <DeleteOutlineTwoTone
                    onClick={(event) => {
                      db.collection("Chats").doc(chatid).delete();
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </div>

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
