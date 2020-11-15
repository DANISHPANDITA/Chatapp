import { Avatar, IconButton } from "@material-ui/core";
import InsertEmoticonOutlinedIcon from "@material-ui/icons/InsertEmoticonOutlined";
import React, { useState, useEffect, useRef } from "react";
import "./Body.css";
import Picker from "emoji-picker-react";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import CancelIcon from "@material-ui/icons/Cancel";
import { DeleteForever } from "@material-ui/icons";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
function Body() {
  const [img, setimg] = useState("");
  const [sate, setsate] = useState(false);
  const ROOT_CSS = css({
    height: 400,
    width: 270,
  });
  const [chosenEmoji, setChosenEmoji] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [input, setinput] = useState("");
  const { chatid } = useParams();
  const [chatname, setchatname] = useState("");
  const [message, setmessage] = useState([]);

  useEffect(() => {
    if (chatid) {
      db.collection("Chats")
        .doc(chatid)
        .onSnapshot((snapshot) => setchatname(snapshot.data().Name));
      db.collection("Chats")
        .doc(chatid)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setmessage(
            snapshot.docs.map((doc) => ({ id: doc.id, doc: doc.data() }))
          )
        );
    }
  }, [chatid]);
  console.log(message);
  useEffect(() => {
    setimg(Math.floor(Math.random() * 100000));
  }, []);
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject.emoji);
    setinput(input.concat(chosenEmoji));
  };

  const picker = () => {
    setsate(true);
  };
  const cancelPicker = () => {
    setsate(false);
  };
  const handleSend = (e) => {
    e.preventDefault();
    db.collection("Chats").doc(chatid).collection("messages").add({
      message: input,
      Name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setinput("");
  };
  return (
    <div className="chat">
      <div className="chatHeader">
        <Avatar
          src={`https://avatars.dicebear.com/api/male/${img}.svg?mood[]=happy`}
          alt=""
        />
        <h3>{chatname}</h3>
      </div>
      <ScrollToBottom className={ROOT_CSS}>
        <div className="chatBody">
          {message.map((message) => (
            <p
              className={`chat_message ${
                message.doc.Name === user.displayName && "chat_receiver"
              }`}
            >
              {message.doc.message}
              {message.doc.Name === user.displayName && (
                <IconButton className="deleteButton">
                  <DeleteForever
                    className="delete_btn"
                    onClick={(event) => {
                      db.collection("Chats")
                        .doc(chatid)
                        .collection("messages")
                        .doc(message.id)
                        .delete();
                    }}
                  ></DeleteForever>
                </IconButton>
              )}
              <span className="chat_name">{message.doc.Name}</span>
              <span className="chat_timestamp">
                {new Date(message.doc.timestamp?.toDate())
                  .toTimeString()
                  .slice(0, 8)}
              </span>
            </p>
          ))}
        </div>
      </ScrollToBottom>
      <div className="chatFooter">
        <div className="emojiButtons">
          <IconButton>
            <InsertEmoticonOutlinedIcon className="emoji" onClick={picker} />
          </IconButton>
          {sate && (
            <Picker
              className="picker_emoji"
              onEmojiClick={onEmojiClick}
              disableSearchBar={true}
            />
          )}
          <IconButton>
            <CancelIcon className="emoji" onClick={cancelPicker} />
          </IconButton>
        </div>
        <form>
          <input
            autoFocus
            value={input}
            onChange={(e) => setinput(e.target.value)}
            placeholder="Type your message..."
          />
          <button disabled={!input} onClick={handleSend}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
export default Body;
