import { Avatar, IconButton } from "@material-ui/core";
import InsertEmoticonOutlinedIcon from "@material-ui/icons/InsertEmoticonOutlined";
import React, { useState, useEffect } from "react";
import "./Body.css";
import Picker from "emoji-picker-react";
import { useParams } from "react-router-dom";
import db, { storage } from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import CancelIcon from "@material-ui/icons/Cancel";
import { DeleteForever } from "@material-ui/icons";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";

function Body() {
  var h = 0;
  var w = 0;
  if (window.screen.availWidth > 393) {
    h = 540;
    w = 930;
  } else {
    h = 420;
    w = 170;
  }

  const [img, setimg] = useState("");
  const [sate, setsate] = useState(false);
  const [media, setmedia] = useState(null);
  const ROOT_CSS = css({
    height: h,
    width: w,
  });
  const [chosenEmoji, setChosenEmoji] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [input, setinput] = useState("");
  const [names, setnames] = useState([]);
  const { chatid } = useParams();
  const [chatname, setchatname] = useState("");
  const [message, setmessage] = useState([]);

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setmedia(e.target.files[0]);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`media/${media.name}`).put(media);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
          default:
            console.log("..");
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          db.collection("Chats").doc(chatid).collection("messages").add({
            message: downloadURL,
            Name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      }
    );

    setmedia(null);
  };

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

  useEffect(() => {
    if (chatid) {
      db.collection("Chats")
        .doc(chatid)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setnames(snapshot.docs.map((doc) => doc.data().Name))
        );
    }
  }, [chatid]);

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
      <div className="grp">
        <ScrollToBottom className={ROOT_CSS}>
          <div className="chatBody">
            {message.map((message) => {
              if (message.doc.message.includes("https")) {
                if (message.doc.message.includes("pdf")) {
                  return (
                    <p
                      className={`chat_message ${
                        message.doc.Name === user.displayName && "chat_receiver"
                      }`}
                    >
                      <a href={message.doc.message} className="pdfMedia">
                        <object
                          className="mediaFile"
                          data={message.doc.message}
                          type="application/pdf"
                          width="35%"
                          height="100%"
                          name="PDF"
                        >
                          Can't Load PDF
                        </object>
                      </a>
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
                  );
                } else
                  return (
                    <p
                      className={`chat_message ${
                        message.doc.Name === user.displayName && "chat_receiver"
                      }`}
                    >
                      <img
                        className="message_media"
                        src={message.doc.message}
                        alt="Can't be loaded"
                      />

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
                  );
              } else
                return (
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
                );
            })}
            <div className="emojiButtons">
              <IconButton>
                <InsertEmoticonOutlinedIcon
                  className="emoji"
                  onClick={picker}
                />
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
          </div>
        </ScrollToBottom>
        <div className="joined_name">
          <marquee className="marquee">Members</marquee>
          <table>
            <tbody>
              {names.filter(onlyUnique).map((name, i) => (
                <tr key={i}>
                  <td>{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="chatFooter">
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
          <div className="fileSendButtons">
            <form>
              <input
                className="fileInput"
                type="file"
                size="60"
                id="files"
                onChange={handleChange}
              />
              <button
                onClick={handleClick}
                className="fileSelection"
                for="files"
                disabled={!media}
              >
                Send A File
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Body;
