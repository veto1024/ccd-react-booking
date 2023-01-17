import { useCookies } from "react-cookie";
import { createContext, useEffect, useMemo, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { API_URL, useApi } from "../../api/apiCalls";
import LoginForm from "./LoginForm";
import { MainLayout } from "../../layouts/MainLayout";

export interface DashboardContextType {
  spinnerStatus: boolean;
  setSpinnerStatus: (arg0: boolean) => void;
}

export type UserContextType = {
  CsrfToken: string;
  logoutToken: string;
  roles: string[] | undefined;
  setCsrfToken: (arg0: string) => void;
  setLogoutToken: (arg0: string) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function useUserContext() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
}

export function useDashboardContext() {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardContextProvider"
    );
  }
  return context;
}

export const AuthenticationWrapper = () => {
  const [loginCookie, setLoginCookie] = useCookies(["ccd_login"]);
  const [spinnerStatus, setSpinnerStatus] = useState<boolean>(true);
  const [CsrfToken, setCsrfToken] = useState<string>("");
  const [roles, setRoles] = useState<string[] | undefined>(undefined);
  const [logoutToken, setLogoutToken] = useState<string>("");
  const dashboardMemoValues = useMemo(
    () => ({
      spinnerStatus,
      setSpinnerStatus,
    }),
    [spinnerStatus]
  );

  const userMemoValues = useMemo(
    () => ({
      CsrfToken,
      logoutToken,
      setCsrfToken,
      setLogoutToken,
      roles,
    }),
    [CsrfToken, roles, logoutToken]
  );

  const handleSuccessfulLogin = (
    uid: number,
    CsrfToken: string,
    logoutToken: string,
    roles: string[]
  ) => {
    // Apparently we do not need /session/token
    setCsrfToken(CsrfToken);
    setLoginCookie("ccd_login", { uid, CsrfToken, logoutToken, roles });
    setRoles(roles);
    setLoading(true);
    // getToken().then((res) => {
    //   if (res.status === 200) {
    //     res.text().then((json) => {
    //       setCsrfToken(CsrfToken);
    //       setLoginCookie("ccd_login", { uid, CsrfToken, logoutToken, roles });
    //       setRoles(roles);
    //       setLoading(true);
    //     });
    //   }
    // });
  };

  useEffect(() => {
    setSpinnerStatus(true);
    if (loginCookie.ccd_login) {
      if (loginCookie.ccd_login.CsrfToken) {
        setCsrfToken(loginCookie.ccd_login.CsrfToken);
      }
    }
  }, [loginCookie.ccd_login]);

  const { data, loading, errorStatus, responseCode, setLoading } = useApi<
    string | number
  >(CsrfToken, `${API_URL}/user/login_status?_format=json`);

  return (
    <DashboardContext.Provider value={dashboardMemoValues}>
      <Backdrop
        sx={{
          color: "black",
          opacity: 1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={spinnerStatus}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <UserContext.Provider value={userMemoValues}>
        <>
          {loading ? (
            <Backdrop
              sx={{
                color: "black",
                opacity: 1,
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={spinnerStatus}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : null}

          {!loading && data === 1 && loginCookie.ccd_login ? (
            <MainLayout />
          ) : null}
          {(!loading && data === 0) || (!loading && !loginCookie.ccd_login) ? (
            <LoginForm
              onLoginSuccess={handleSuccessfulLogin}
              emailOnly={false}
            />
          ) : null}
          {!loading && errorStatus ? (
            <p>
              There was an error communicating with the server. Response code:{" "}
              {responseCode}
            </p>
          ) : null}
        </>
      </UserContext.Provider>
    </DashboardContext.Provider>
  );
};
