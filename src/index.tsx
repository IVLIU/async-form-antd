import React from 'react';
import { render } from 'react-dom';
import './index.css';
import AsyncForm from './AsyncForm';
import * as serviceWorker from './serviceWorker';

const formSchema = {
  "title": "normal",
  "description": "desc",
  "fields": [
    {
      "field": "username",
      "name": "用户名",
    },
    {
      "field": "password",
      "name": "密码",
    },
  ]
}

const formData = {
  "username": "ivliu",
  "password": "123456"
}

render(
  <AsyncForm 
    formSchema={formSchema} 
    formData={formData}
    callback={(val: any) => console.log('callback', val)} 
  />, 
  document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
