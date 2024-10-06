import React, { useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideoCamera,
  faUpload,
  faPhone,
  faCommentAlt,
  faInfoCircle,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Room = () => {
  const [myPeer, setMyPeer] = useState(null);
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [screenSharing, setScreenSharing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPeer, setCurrentPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomID, setRoomID] = useState();
  const videoGrid = useRef(null); // Use useRef for video grid
  const myVideo = useRef(null); // Use useRef for my video
  const [socket, setSocket] = useState(null);

  const { datastate } = useContext(AppContext);
  const userName = datastate.name;
  const { roomid } = useParams();
  const socketInstance = io(
    import.meta.env.VITE_API_KEY
    // path: "/socket.io",
    // transports: ["websocket", "polling"], // Sử dụng WebSocket nếu có thể
    // secure: true,
    // reconnection: true,
    // reconnectionDelay: 1000,
    // reconnectionDelayMax: 5000,
    // reconnectionAttempts: Infinity, // Thử kết nối lại vô hạn lần
    // withCredentials: true, // Thiết
  );
  const newPeer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "8080",
  });

  useEffect(() => {
    setRoomID(roomid);
  }, [roomid]);

  useEffect(() => {
    setSocket(socketInstance);
    socketInstance.connect();
    setMyPeer(newPeer);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyVideoStream(stream);
        if (myVideo.current) {
          addVideoStream(myVideo.current, stream, userName);
        }

        newPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream, userName);
          });
          setCurrentPeer(call);
        });

        socketInstance.on("user-connected", (userId) => {
          setTimeout(() => connectToNewUser(userId, stream), 1000);
        });
      });

    socketInstance.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });

    newPeer.on("open", (id) => {
      socketInstance.emit("join-room", roomID, id, userName);
    });

    socketInstance.on("recieve-message", (inputMsg, senderName) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMsg, sender: senderName, time: formatAMPM(new Date()) },
      ]);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, [roomID, peers, myVideo, userName]);

  const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream, userName);
    });
    call.on("close", () => {
      video.remove();
    });
    setPeers((prevPeers) => ({ ...prevPeers, [userId]: call }));
    setCurrentPeer(call);
  };

  const addVideoStream = (video, stream, name) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    const outerDiv = document.createElement("div");
    outerDiv.classList.add("user-video");
    outerDiv.appendChild(video);

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("user-name");
    nameDiv.innerText = name;

    outerDiv.appendChild(nameDiv);
    if (videoGrid.current) {
      videoGrid.current.appendChild(outerDiv);
    }
  };

  const muteUnmuteUser = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    myVideoStream.getAudioTracks()[0].enabled = !enabled;
  };

  const turnUserVideoOnOff = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    myVideoStream.getVideoTracks()[0].enabled = !enabled;
  };

  const startScreenShare = () => {
    if (screenSharing) {
      stopScreenSharing();
      return;
    }

    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((screenStream) => {
        const videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = stopScreenSharing;

        if (myPeer) {
          const sender = currentPeer.peerConnection
            .getSenders()
            .find((s) => s.track.kind === videoTrack.kind);
          sender.replaceTrack(videoTrack);
          setScreenSharing(true);
        }
      });
  };

  const stopScreenSharing = () => {
    if (!screenSharing) return;
    const videoTrack = myVideoStream.getVideoTracks()[0];
    const sender = currentPeer.peerConnection
      .getSenders()
      .find((s) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
    setScreenSharing(false);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    const inputMsg = e.target.message.value;
    if (inputMsg.trim()) {
      socket.emit("send-message", inputMsg, userName);
      e.target.message.value = "";
    }
  };

  const toggleExpand = (event) => {
    if (isExpanded) {
      event.target.style.height = "150px";
      event.target.style.width = "250px";
      setIsExpanded(false);
    } else {
      event.target.style.height = "80vh";
      event.target.style.width = "70vw";
      setIsExpanded(true);
    }
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div id="main-div" className="flex flex-col">
      <div className="flex">
        <div
          id="video-grid"
          className="h-[90vh] w-[1000px] flex justify-start flex-wrap content-start border border-black"
          ref={videoGrid} // Use ref here
        ></div>
        <ChatBox
          messages={messages}
          handleSubmitMessage={handleSubmitMessage}
        />
      </div>
      <ControlsTab
        muteUnmuteUser={muteUnmuteUser}
        turnUserVideoOnOff={turnUserVideoOnOff}
        startScreenShare={startScreenShare}
      />
    </div>
  );
};

const ChatBox = ({ messages, handleSubmitMessage }) => (
  <div
    id="chat-box"
    className="w-[350px] m-4 h-[78vh] rounded-xl bg-white flex flex-col justify-between p-4"
  >
    <div
      id="chat-header"
      className="font-sans text-lg mb-8 flex flex-row justify-between"
    >
      <div>In-call messages</div>
      <div
        id="close-chat-div"
        className="cursor-pointer mr-2 h-[22px] w-[23px] p-2 text-center rounded-full -mt-2 ml-4 hover:bg-gray-200 transition ease-in-out duration-500"
      >
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </div>
    <div id="chats" className="min-h-[57vh] overflow-y-scroll mb-4 break-words">
      <div
        id="messages-info"
        className="text-sm text-gray-500 bg-gray-200 h-8 w-64 p-4 text-center rounded-full font-sans mb-2"
      >
        Messages can only be seen by people in the call and are deleted when the
        call ends
      </div>
      <ul id="messages" className="list-none">
        {messages.map((msg, index) => (
          <li key={index}>
            <b style={{ fontSize: ".9rem" }}>{msg.sender}</b>&nbsp;
            {msg.time}
            <br />
            <br />
            {msg.text}
          </li>
        ))}
      </ul>
    </div>
    <form
      id="form"
      className="bg-gray-200 rounded-full flex"
      onSubmit={handleSubmitMessage}
    >
      <input
        type="text"
        name="message"
        id="message-form"
        className="w-4/5 h-12 rounded-full border-none bg-gray-200 pl-4 focus:outline-none"
        placeholder="Send a message to everyone"
        autoComplete="off"
      />
      <button
        type="submit"
        className="border-none bg-gray-200 text-blue-600 text-xl cursor-pointer"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  </div>
);

const ControlsTab = ({
  muteUnmuteUser,
  turnUserVideoOnOff,
  startScreenShare,
}) => (
  <div
    id="controls-tab"
    className="bg-gray-900 w-full h-[10vh] flex justify-between flex-row mr-8"
  >
    <div id="time" className="text-white mr-16 font-sans pl-8 text-lg mt-4">
      {/* Time display here */}
    </div>
    <div className="icons flex flex-row justify-between">
      <div
        className="btn rounded-full h-8 w-11 text-lg text-white mr-4 bg-gray-700 text-center pt-3 cursor-pointer hover:bg-gray-800 transition ease-in-out duration-500"
        onClick={muteUnmuteUser}
      >
        <FontAwesomeIcon icon={faMicrophone} />
      </div>
      <div
        className="btn rounded-full h-8 w-11 text-lg text-white mr-4 bg-gray-700 text-center pt-3 cursor-pointer hover:bg-gray-800 transition ease-in-out duration-500"
        onClick={turnUserVideoOnOff}
      >
        <FontAwesomeIcon icon={faVideoCamera} />
      </div>
      <div
        className="btn rounded-full h-8 w-11 text-lg text-white mr-4 bg-gray-700 text-center pt-3 cursor-pointer hover:bg-gray-800 transition ease-in-out duration-500"
        onClick={startScreenShare}
      >
        <FontAwesomeIcon icon={faUpload} />
      </div>
      <a>
        <div className="end-btn bg-red-600 text-white w-15 pt-3 h-8 rounded-full text-lg text-center cursor-pointer hover:bg-red-500 transition ease-in-out duration-500">
          <FontAwesomeIcon icon={faPhone} />
        </div>
      </a>
    </div>
    <div className="icons flex flex-row justify-between">
      <div className="btn rounded-full h-8 w-11 text-lg text-white mr-4 bg-gray-700 text-center pt-3 cursor-pointer hover:bg-gray-800 transition ease-in-out duration-500">
        <FontAwesomeIcon icon={faCommentAlt} />
      </div>
      <div className="btn rounded-full h-8 w-11 text-lg text-white mr-4 bg-gray-700 text-center pt-3 cursor-pointer hover:bg-gray-800 transition ease-in-out duration-500">
        <FontAwesomeIcon icon={faInfoCircle} />
      </div>
      <div className="btn rounded-full h-8 w-11 text-lg text-white mr-4 bg-gray-700 text-center pt-3 cursor-pointer hover:bg-gray-800 transition ease-in-out duration-500">
        <FontAwesomeIcon icon={faUserFriends} />
      </div>
    </div>
  </div>
);

export default Room;
