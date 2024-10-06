import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Page/Home";
import SignIn from "./Page/Auth/SignIn";
import SignUp from "./Page/Auth/SignUp";
import ForgotPassWord from "./Page/Auth/ForgotPassWord";
import Navbar from "./components/Navbar";
import CreateRoom from "./Page/HomeRoom/CreateRoom";
import Room from "./Page/HomeRoom/Room";
import { useEffect, useState } from "react";
import ListRoom from "./Page/HomeRoom/ListRoom";
import TestRoom from "./Page/HomeRoom/TestRoom";
import { AppContext } from "./Context/Context";
import { useContext } from "react";
import RoomChat from "./Page/ChatRoom/RoomChat";
import Maybe from "./Page/Maybe/Maybe";
import ListContest from "./Page/Contest/ListContest";
import ContestCreate from "./Page/Contest/ContestCreate";
import MyContest from "./Page/Contest/MyContest";
import Contest from "./Page/Contest/Contest";
import Toast from "./components/ToastSuccess";
import AuthCode from "./Page/Auth/AuthCode";
import StartContest from "./Page/Contest/StartContest";
import TableResult from "./Page/Contest/TableResult";
import FormUpdateContest from "./components/FormUpdateContest";
import FormInfoContest from "./components/FormInfoContest";
import { ToastContainer } from "react-toastify";
import { Buffer } from "buffer";
import process from "process";
import Meet from "./Page/Meet";
import util from "util";
import { EventEmitter } from "events";

const App = () => {
  const [openNav, setOpenNav] = useState(true);
  const { loading, openToast } = useContext(AppContext);
  const location = useLocation();
  const emitter = new EventEmitter();
  useEffect(() => {
    if (
      location.pathname.startsWith("/test-room") ||
      location.pathname.startsWith("/room") ||
      location.pathname.startsWith("/contest")
    ) {
      setOpenNav(false);
    }
  }, [location.pathname]);
  // if (typeof global === "undefined") {
  //   window.global = window;
  // }
  return (
    <div className="min-h-screen w-full flex flex-col items-center ">
      <Toast />
      {!loading ? (
        <>
          <div className="h-20 w-full z-50 fixed top-0">
            {openNav && <Navbar />}
          </div>
          <ToastContainer />
          <div className="min-h-screen w-full z-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassWord />} />
              <Route path="/create-room" element={<CreateRoom />} />
              <Route path="/room/:roomId" element={<Meet />} />
              <Route path="/list-room" element={<ListRoom />} />
              <Route path="/test-room" element={<TestRoom />} />
              <Route path="/chat-room" element={<RoomChat />} />
              <Route path="/list-test" element={<ListContest />} />
              <Route path="/create-contest" element={<ContestCreate />} />
              <Route path="/my-contest" element={<MyContest />} />
              <Route path="/contest" element={<Contest />} />
              <Route path="/auth-code" element={<AuthCode />} />
              <Route path="/start-contest/:id" element={<StartContest />} />
              <Route path="/table-result/:id" element={<TableResult />} />
              <Route
                path="/form-update-contest/:id"
                element={<FormUpdateContest />}
              />
              <Route
                path="/form-info-contest/:id"
                element={<FormInfoContest />}
              />

              <Route path="/may-be-you-dont-know" element={<Maybe />} />
            </Routes>
          </div>
        </>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default App;
