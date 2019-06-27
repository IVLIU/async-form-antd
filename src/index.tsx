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
          "图文咨询页"
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
      //   {
      //     "title": "菜单1",
      //     "key": 0,
      //   },
      //   {
      //     "title": "菜单2",
      //     "key": 1,
      //   },
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
// {"title":"浮层按钮","required":["content"],"fields":[{"field":"content","name":"模块内容"},{"field":"fontSize","name":"字体大小","widget":"Radio","defaultValue":1,"enum":[[0,"大"],[1,"中"],[2,"小"]]},{"field":"link","name":"跳转链接"},{"field":"background","name":"背景颜色"}]}


const formData = {
  isShowPrice: "0",
  link: "1",
  style: "0",
  title: "123",
}
// {
//   "isShowPrice":"1",
//   "doctors":[
//     [
//       {price: "义诊十元", doctorIds: "123"},
//       {price: undefined, doctorIds: "qwer"},
//       {price: undefined, doctorIds: "asdf"}
//     ],
//     [{price: "义诊两元", doctorIds: "456"}],
//     [{price: "免费义诊", doctorIds: "789"}],
//     [{price: undefined, doctorIds: "000"}],
//   ],
//   "link":"2",
//   "tabs":[
//     {
//       "title": "妇科",
//       "key": 0,
//     },
//     {
//       "title": "儿科",
//       "key": 1,
//     },
//     {
//       "title": "内科",
//       "key": 2,
//     },
//     {
//       "title": "外科",
//       "key": 3,
//     },
//   ],
//   "style":"0",
//   "title":"主任"
// }

render(
  <AsyncForm 
    formSchema={formSchema} 
    formData={formData}
    callback={(val: any) => console.log('callback', val)} 
    callbackOfEdit={() => console.log('edit status is true.')}
  />, 
  document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
