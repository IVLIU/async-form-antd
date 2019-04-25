import React from 'react';
import { render } from 'react-dom';
import './index.css';
import AsyncForm from './AsyncForm';
import * as serviceWorker from './serviceWorker';

const formSchema = {
  "title": "单列医生",
  "description": "单列医生的表单结构设计",
  "required": [
    "title",
    "link"
  ],
  "smallPic": [
    {
      "field": "doctorIds",
      "tips": "请在此处添加医生ID"
    },
  	{
      "field": "price",
      "widget": "TextArea",
      "tips": "请在此处添加义诊价描述"
    },
    {
      "field": "isShowPrice",
      "widget": "Radio",
      "enum": [
        ["1", "是否显示价格"],
      ],
      "defaultValue": "0",
    }
  ],
  "bigPic": [
    {
      "field": "doctorIds",
      "tips": "请在此处添加医生ID"
    },
    {
      "field": "label",
      "tips": "请在此处添加标签文案，用逗号隔开。例如xx,xx,xx"
    },
    {
      "field": "consult",
      "tips": "请在此处添加资讯文案"
    },
    {
      "field": "comment",
      "tips": "请在此处添加评价文案"
    },
    {
      "field": "price",
      "widget": "TextArea",
      "tips": "请在此处添加义诊价描述"
    },
    {
      "field": "isShowPrice",
      "widget": "Radio",
      "enum": [
        ["1", "是否显示价格"],
      ],
      "defaultValue": "0",
    }
  ],
  "fields": [
    {
      "field": "title",
      "name": "标题",
      "max": 10,
    },
    {
      "field": "style",
      "name": "模块样式",
      "widget": "Radio",
      "enum": [
        ["1", "大图"],
        ["0", "小图"]
      ],
      "defaultValue": "0",
    },
    {
      "field": "link",
      "name": "跳转页面",
      "widget": "Select",
      "enum": [
        ["https://www.baidu.com", "医生主页"],
        ["https://www.sina.com", "服务中间页"]
      ],
      "tips": "请选择跳转到的页面"
    },
    {
      "field": "doctors",
      "type": "array",
      "by": "style",
      "ref": {
        "1": "bigPic",
        "0": "smallPic",
      }
    }
  ],
}

const formData = {"title":"单列医生","style":"0","link":"https://www.sina.com","doctors":[[{"isShowPrice":"0","price":"描述1","doctorIds":"1234123"},{"isShowPrice":"1","price":"描述2","doctorIds":"1342422"}]]};

render(
  <AsyncForm 
    formSchema={formSchema} 
    formData={formData}
    callback={(val: any) => console.log('callback', JSON.stringify(val))} 
  />, 
  document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
