import React from 'react';
import { render } from 'react-dom';
import './index.css';
import AsyncForm from './AsyncForm';
import * as serviceWorker from './serviceWorker';

const formSchema = {
  "bigPic":[
    {
      "field":"doctorIds",
      "tips":"请在此处添加医生ID"
    },
    {
      "field":"label",
      "tips":"请在此处添加标签文案，用逗号隔开。例如xx,xx,xx"
    },
    {
      "field":"consult",
      "tips":"请在此处添加咨询文案"
    },
    {
      "field":"comment",
      "tips":"请在此处添加好评文案"
    },
    {
      "widget":"TextArea",
      "field":"price",
      "tips":"请在此处添加义诊价描述"
    }
  ],
  "description":"多列医生的表单结构设计",
  "smallPic":[
    {
      "field":"doctorIds",
      "tips":"请在此处添加医生ID"
    },
    {
      "widget":"TextArea",
      "field":"price",
      "tips":"请在此处添加义诊价描述"
    }
  ],
  "title":"多列医生",
  "fields":[
    {
      "field":"title",
      "max":10,
      "name":"标题"
    },
    {
      "widget":"Radio",
      "field":"style",
      "defaultValue":"0",
      "name":"模块样式",
      "enum":[
        [
          "1",
          "大图"
        ],
        [
          "0",
          "小图"
        ]
      ]
    },
    {
      "widget":"Radio",
      "field":"isShowPrice",
      "defaultValue":"0",
      "name":"显示价格",
      "enum":[
        [
          "1",
          "是"
        ],
        [
          "0",
          "否"
        ]
      ]
    },
    {
      "widget":"Select",
      "field":"link",
      "name":"跳转页面",
      "enum":[
        [
          "1",
          "医生主页"
        ],
        [
          "2",
          "服务中间页"
        ]
      ],
      "tips":"请选择跳转到的页面"
    },
    {
      "ref":{
        "0":"smallPic",
        "1":"bigPic"
      },
      "field":"doctors",
      "by":"style",
      // "tabs":[
      //   // {
      //   //   "title": "菜单1",
      //   //   "key": "1",
      //   // },
      //   // {
      //   //   "title": "菜单2",
      //   //   "key": "2",
      //   // },
      //   '菜单1', '菜单2'
      // ],
      "type":"array"
    }
  ],
  "required":[
    "title",
    "link",
    "doctorIds",
  ]
};

const formData = {
  "isShowPrice":"0",
  "doctors":[
    [
      {
        "doctorIds":"81978"
      },
      {
        "doctorIds":"82296"
      }
    ]
  ],
  "link":"1",
  "style":"0",
  "title":"多列医生"
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
