import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FBConnectPage from "./Components/FBConnectPage";
import { useEffect } from "react";
import { Api, resetApiHeaders } from "./API/Axios";
import { showError } from "./lib/utils";
import { useAuth } from "./Hooks/auth";
import Landing from "./Components/Home";
import CustomRouteLayout from "./Components/CustomRoute/CustomRouteLayout";
import CustomRoute from "./Components/CustomRoute/CustomRoute";
import Loader from "./Components/Loading";
import { useLoader } from "./Hooks/loader";
import Helpdesk from "./Components/HelpDesk";
import ChatPortal from "./Components/Agent";
import ManagePage from "./Components/ManagePage";

function App() {
  const auth = useAuth();
  const loader = useLoader();
  const navigate = useNavigate();

  const getUser = async () => {
    auth.setInitialised();
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token === "" || token === undefined || token === null) {
      return;
    }
    loader.setLoading(true);
    await Api.get("/auth/get-user")
      .then((res) => {
        const userData = res.data.user;
        auth.setInitialised();
        auth.setUserData(userData);
        auth.setLoggedIn(true);
        resetApiHeaders(token);
      })
      .catch((err) => {
        loader.setLoading(false);
        auth.setInitialised();
        showError("Session timed out");
        auth.logout();
      });
    loader.setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Routes>
        <Route element={<CustomRouteLayout />}>
          <Route
            path="/"
            element={
              <CustomRoute
                element={<Landing />}
                visibleToAuthenticatedUser={false}
              />
            }
          />
          <Route
            path="/login"
            element={
              <CustomRoute
                element={<Login />}
                visibleToAuthenticatedUser={false}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <CustomRoute
                element={<Signup />}
                visibleToAuthenticatedUser={false}
              />
            }
          />
          <Route
            path="/connect-page"
            element={
              <CustomRoute
                element={<FBConnectPage />}
                visibleToUnauthenticatedUser={false}
              />
            }
          />

          <Route
            path="/helpdesk"
            element={
              <CustomRoute
                element={<Helpdesk />}
                visibleToUnauthenticatedUser={false}
              />
            }
          >
            <Route index element={<ChatPortal />} />
            <Route path="manage-page" element={<ManagePage />} />
            <Route path="*" element={<ChatPortal />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="bottom-center" stacked />
      {loader.loading ? <Loader /> : null}
    </>
  );
}

export default App;
