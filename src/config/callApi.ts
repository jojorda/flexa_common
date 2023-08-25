import axios from "axios";

export function callApi(url, method, params) {
  let headerWebService = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("flexa_token"),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length",
  };
  if (method == "GET") {
    return axios.get(url, {
      headers: headerWebService,
    });
  } else if (method == "POST") {
    return axios.post(url, params, {
      headers: headerWebService,
    });
  } else if (method == "PUT") {
    return axios.put(url, params, {
      headers: headerWebService,
    });
  } else if (method == "DELETE") {
    return axios.delete(url, {
      headers: headerWebService,
    });
  }
}
