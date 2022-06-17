import axios from 'axios';
import {ApiGatewayBaseUrl} from '../Environment.cfg';

const LoginAPI = (email, password, rememberMe) => {
  return new Promise(resolve => {
    axios({
      crossDomain: true,
      method: 'post',
      url: `${ApiGatewayBaseUrl}/auth/login`,
      data: {
        email: email,
        password: password,
        rememberMe: rememberMe,
      },
    })
      .then(response => {
        // console.log(response.data);
        if (response.data.status === 200) {
          resolve({
            status: 'SUCCESS',
            message: 'You have successfully logged in',
            data: response.data.data,
          });
        } else {
          resolve({status: 'SOMETHING_WRONG', message: 'Something went wrong'});
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response?.status === 404) {
          resolve({
            status: 'USER_NOT_FOUND',
            message: error.response.data?.messages,
          });
        } else if (error.response?.status === 401) {
          resolve({
            status: 'UNAUTHORIZED',
            message: error.response.data?.messages,
          });
        } else if (error.response?.status === 422) {
          resolve({
            status: 'INVALID_EMAIL',
            message: error.response.data?.data?.email,
          });
        } else {
          resolve({
            status: 'SERVER_ERROR',
            message: 'Failed to contact server',
          });
        }
      });
  });
};

export {LoginAPI};
