import axios from "axios";
import storage from "../storage";
import config from "../../configs";
import {stringify} from "qs";


const request = axios.create({
    baseURL: config.API_ROOT,
    params: {},
    paramsSerializer: {
      encode: (params) => stringify(params, {encodeValuesOnly: true}),
      serialize: stringify,
      indexes: false
    },
  })
;

request.interceptors.request.use((config) => {
  const token = storage.get('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config;
}, (error) => {
  console.log(error)
});

request.interceptors.response.use((response) => {

  return response;
}, (error) => {
  const statusCode = error.response.status;
  console.log('error', error?.response)
  if (statusCode == 401) {
    window.localStorage.clear();
  }
  return Promise.reject(error);
});

export {request};
