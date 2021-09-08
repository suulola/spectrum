const axios = require('axios')

const instance = axios.create({
  baseURL: 'https://staging.spectrumpay.com.ng/api/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
});

instance.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  async function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

module.exports = {
  get(url, request) {
    return instance
      .get(url, request)
      .then((response) => Promise.resolve(response.data))
      .catch(error => Promise.reject(error?.response?.data));
  },
  post(url, request) {
    return instance
      .post(url, request)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        console.log(JSON.stringify(error), 'error calling');
        return Promise.resolve(error?.response?.data);
      });
  },

  put(url, request) {
    return instance
      .put(url, request)
      .then(response => Promise.resolve(response.data))
      .catch((error) => {
        console.log(error, 'error calling');
        return Promise.reject(error?.response?.data);
      });
  },
  patch(url, request) {
    return instance
      .patch(url, request)
      .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error?.response?.data));
  },
  delete(url, request) {
    return instance
    .delete(url, {data: request})
    .then(response => Promise.resolve(response))
      .catch(error => Promise.reject(error?.response?.data));
  },
};
