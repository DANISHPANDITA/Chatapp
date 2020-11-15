import React, { useState, useEffect } from "react";
import "./SideBar.css";
import { Avatar, IconButton } from "@material-ui/core";
import firebase from "firebase";
import { SearchOutlined } from "@material-ui/icons";
import SideBarChat from "./SideBarChat";
import db from "./firebase";
function SideBar({ img, name }) {
  const [chat, setchat] = useState([]);
  const [search, setsearch] = useState("");
  useEffect(() => {
    db.collection("Chats").onSnapshot((snapshot) =>
      setchat(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);
  const handleLogOut = () => {
    firebase.auth().signOut();
  };

  return (
    <div className="sideBar">
      <div className="sidebarHeader">
        <div className="sidebarHeaderLeft">
          <Avatar src={img} alt="" />
          <small>{name}</small>
        </div>
        <div className="sidebarHeaderRight">
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      </div>
      <div className="sidebarSearch">
        <input
          type="text"
          value={search}
          onChange={(e) => setsearch(e.target.value.toLowerCase())}
          placeholder="Search For Chats"
        />
        <IconButton>
          <SearchOutlined className="search_icon" />
        </IconButton>
      </div>

      <div className="sideBarChat">
        <SideBarChat addNewChat />

        {chat
          .filter((data) => {
            if (search == null) return data;
            else if (data.data.Name.toLowerCase().includes(search)) {
              return data;
            }
          })
          .map((chat) => (
            <SideBarChat key={chat.id} id={chat.id} Name={chat.data.Name} />
          ))}
      </div>
    </div>
  );
}

export default SideBar;
