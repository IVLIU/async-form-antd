import React from 'react';
import { render } from 'react-dom';
import './index.css';
import AsyncForm from './AsyncForm';
import * as serviceWorker from './serviceWorker';

const formSchema = {
  "title":"浮层按钮",
  "fields":[
    {
      "field":"content",
      "name":"模块内容"
    },
    {
      "widget":"Radio",
      "field":"fontSize",
      "defaultValue":1,
      "name":"字体大小",
      "enum":[
        [
          0,
          "大"
        ],
        [
          1,
          "中"
        ],
        [
          2,
          "小"
        ]
      ]
    },
    {
      "field":"link",
      "name":"跳转链接"
    },
    {
      "field":"background",
      "name":"背景颜色"
    }
  ]
}

const formData ={
  "background":"666",
  "link":"http://www.sina.com",
  "fontSize":1,
  "title":"浮层模块1557909243805",
  "content":"浮层颜色测试"
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
