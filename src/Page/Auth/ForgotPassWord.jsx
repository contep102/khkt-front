import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/Context";
import axios from "axios";

const ForgotPassWord = () => {
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { setToastMessage, setOpenToast, setLoading, setStatusToast } = useContext(AppContext);
  const navigate = useNavigate();
  const handleSendRequest = async () => {
    if (email === "") {
      setOpenToast(false);
      setToastMessage("Plese fill all field!");
      setStatusToast("warning")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
    const data = await axios.post(
      `${import.meta.env.VITE_API_KEY}/api/user/send-code-forgot-pass`,
      { email: email }
    );
    if (data.data.status === 200) {
      setOpen(false);
    }
    if (data.data.status === 210) {
      setOpenToast(false);
      setToastMessage(data.data.message);
      setStatusToast("warning")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
    if (data.data.status === 400) {
      setOpenToast(false);
      setToastMessage("Something error in server!");
      setStatusToast("error")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
  };
  const handleChangePass = async () => {
    if (code === "" || pass === "" || confirmPass === "") {
      setOpenToast(false);
      setToastMessage("Plese fill all field!");
      setStatusToast("warning")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
    if (pass !== confirmPass) {
      setOpenToast(false);
      setToastMessage("Password is not equal confirmPassword!");
      setStatusToast("warning")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
    const data = await axios.post(
      `${import.meta.env.VITE_API_KEY}/api/user/reset-pass`,
      { email: email, code: code, newPass: pass }
    );
    if (data.data.status === 200) {
      setOpenToast(false);
      setToastMessage("Change password success");
      setStatusToast("success")

      setStatusToast("success")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
        navigate("/sign-in");
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
    if (data.data.status === 210) {
      setOpenToast(false);
      setToastMessage(data.data.message);
      setStatusToast("warning")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
    if (data.data.status === 400) {
      setOpenToast(false);
      setToastMessage("Something error in server!");
      setStatusToast("error")

      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, [1700]);
      return () => {
        clearTimeout(timer);
      };
    }
  };
  return (
    <div className="w-full h-screen overflow-hidden">
      {open ? (
        <div className=" min-h-screen w-full bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Input your email
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleSendRequest}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" min-h-screen w-full bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              We send code to email
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code
                  </label>
                  <div className="mt-1">
                    <input
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                      value={code}
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your code"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      onChange={(e) => {
                        setPass(e.target.value);
                      }}
                      value={pass}
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      name="password"
                      type="password"
                      onChange={(e) => {
                        setConfirmPass(e.target.value);
                      }}
                      value={confirmPass}
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <button className="font-medium text-blue-600 hover:text-blue-500">
                      Reset send code!
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleChangePass}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassWord;
