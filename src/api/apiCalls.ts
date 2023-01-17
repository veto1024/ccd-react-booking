import React, { useContext, useEffect, useState } from "react";
import fetchWithTimeout from "../utils/FetchWithTimeout";
import {
  UserContext,
  UserContextType,
  useUserContext,
} from "../components/authentication/AuthenticationWrapper";

export interface ApiReturnType<T> {
  loading: boolean;
  data?: T;
  errorStatus: boolean;
  noContent: boolean;
  responseCode: number | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const API_URL = `${process.env.REACT_APP_API_HTTP_PROTOCOL}://${process.env.REACT_APP_API_URL}`;
export const APP_URL = `${process.env.REACT_APP_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_APP_URL}`;

type optionsType = {
  timeout: number;
  method: string;
  headers: Headers;
  credentials?: string;
  body?: any;
  "X-Csrf-Token"?: string;
};

export function apiCall(
  CsrfToken: string | undefined,
  url: string,
  method = "GET",
  body: string | object | undefined | null = null,
  credentials = "include"
): Promise<any> {
  const headers = new Headers({
    Host: `${APP_URL}`,
    "Access-Control-Allow-Origin": `${APP_URL}`,
    Origin: `${APP_URL}`,
    "Content-Type": "application/json",
  });
  if (CsrfToken) {
    headers.set("X-CSRF-Token", CsrfToken);
  }

  let options: optionsType = {
    timeout: 4000,
    method,
    headers,
    credentials,
  };
  if (body) {
    options = { ...options, body };
  }

  return fetchWithTimeout(url, options);
}

export const useApi = <T>(
  CsrfToken: string | undefined,
  url: string,
  method = "GET",
  body: undefined | string | object | null = null,
  credentials = "include"
): ApiReturnType<T> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [noContent, setNoContent] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const [responseCode, setResponseCode] = useState<number | null>(null);
  const [data, setData] = useState<T>();

  const fetchApi = () => {
    apiCall(CsrfToken, url, method, body, credentials)
      .then((res) => {
        if (res.status === 200) {
          res.json().then((json: T) => {
            setData(json);
            setResponseCode(200);
          });
        } else if (res.status === 204) {
          setResponseCode(204);
          setNoContent(true);
        } else if (
          res.status === 404 ||
          res.status === 400 ||
          res.status === 500
        ) {
          setResponseCode(res.status);
          setErrorStatus(true);
        }
      })
      .catch((reason) => {
        setResponseCode(500);
        setErrorStatus(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApi();
  }, [loading]);

  return { loading, data, errorStatus, noContent, responseCode, setLoading };
};

export function postEvent(CsrfToken: string, body: string) {
  const url = `${API_URL}/api/booking/event/create`;
  return apiCall(CsrfToken, url, "POST", body);
}

/**
 * Logs the user in and returns the uid, username, CsrfToken and logoutToken
 *
 */

export function loginUser({
  name,
  pass,
}: {
  name: string;
  pass: string;
}): Promise<Response> {
  const url = `${API_URL}/user/login?_format=json`;
  return apiCall("", url, "POST", JSON.stringify({ name, pass }));
}

/**
 * Logs the  user out
 *
 */

export function logoutUser(): Promise<Response> {
  const url = `${API_URL}/user/logout`;
  return apiCall("", url, "POST", {}, "same-origin");
}

export function getToken(): Promise<Response> {
  const url = `${API_URL}/session/token`;
  return apiCall("", url);
}

export function fetchMainMenu(): Promise<Response> {
  const url = `${API_URL}/api/menu_items/main?_format=json`;
  return apiCall("", url);
}
