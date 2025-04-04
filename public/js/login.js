/* eslint-disable */

import axios from 'axios';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email, //api wala email=parameter wala email
        password
      }
    });

    if (res.data.status === 'success') {
      alert('Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      window.location.replace('/');
    }
  } catch (err) {
    alert('Error logging out! Try again.');
  }
};
