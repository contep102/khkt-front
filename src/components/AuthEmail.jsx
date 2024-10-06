import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/Context";
const AuthEmail = ({ name, email, pass }) => {
  const [code, setCode] = useState("");
  const { setLoading, setToastMessage, setOpenToast, setStatusToast } =
    useContext(AppContext);
  const navigate = useNavigate();
  const handleAuth = async () => {
    setLoading(true);
    const data = await axios.post(
      `${import.meta.env.VITE_API_KEY}/api/user/auth-code`,
      { email: email, code: code }
    );

    if (data.data.status === 200) {
      const data1 = await axios.post(
        `${import.meta.env.VITE_API_KEY}/api/user/sign-up`,
        { email: email, password: pass, name: name }
      );

      if (data1?.data?.status === 200) {
        setToastMessage("Sign up success!");
        setStatusToast("success");

        setLoading(false);
        setOpenToast(true);
        const timer = setTimeout(() => {
          setOpenToast(false);
        }, 1700);
        navigate("/sign-in");
        return () => {
          clearTimeout(timer);
        };
      }
      if (data1?.data?.status === 210) {
        setToastMessage(data1?.data?.message);
        setStatusToast("warning");
        setLoading(false);
        setOpenToast(true);
        const timer = setTimeout(() => {
          setOpenToast(false);
        }, 1700);
        navigate("/");
        return () => {
          clearTimeout(timer);
        };
      }
      if (data1?.data?.status === 400) {
        setToastMessage("Something error in server!");
        setStatusToast("error");
        setLoading(false);
        setOpenToast(true);
        const timer = setTimeout(() => {
          setOpenToast(false);
        }, 1700);
        navigate("/");
        return () => {
          clearTimeout(timer);
        };
      }
    }

    if (data.data.status === 210) {
      setLoading(false);
      setStatusToast("warning");
      setToastMessage(data.data.message);
      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, 1700);
      return () => clearTimeout(timer);
    }
    if (data.data.status === 400) {
      setLoading(false);
      setStatusToast("error");
      setToastMessage("Something error in web server");
      setOpenToast(true);
      const timer = setTimeout(() => {
        setOpenToast(false);
      }, 1700);
      return () => clearTimeout(timer);
    }
  };
  return (
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Verify gmail?
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="text-blue-600 decoration-2 hover:underline font-medium">
                Code Verification code has been sent to your gmail
              </p>
            </p>
          </div>

          <div className="mt-5">
            <div>
              <div className="grid gap-y-4">
                <div>
                  <label className="block text-sm font-bold ml-1 mb-2 dark:text-white">
                    Code here!
                  </label>
                  <div className="relative">
                    <input
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                    />
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to
                    you
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleAuth();
                  }}
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Code!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthEmail;
