import { createContext, useState, useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { initialState, reducer } from "../store";

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [datastate, setDataState] = useState({
    theme: "light",
    user: {
      name: null,
      email: null,
      avatar: null,
      token: null,
      id: null,
    },
  });
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [statusToast, setStatusToast] = useState("success");
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    setDataState({
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      avatar: localStorage.getItem("avatar"),
      token: localStorage.getItem("token"),
      id: localStorage.getItem("id"),
    });
  }, []);
  const updateState = (newState) => {
    setDataState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        datastate,
        updateState,
        toastMessage,
        setToastMessage,
        openToast,
        setOpenToast,
        loading,
        setLoading,
        statusToast,
        setStatusToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
