#### API

#### 说明

这是模块化编辑器，单列医生模块的formSchema的结构设计，下面以此为基础介绍每个字段的意义以及取值。

1. title   (string)   标题
2. description   (string)   描述
3. required   (array)   必填字段枚举，数组项可以是字符串或者数组
   1. 字符串：必须字段的field值
   2. *数组： 第一项是必需字段的field值，第二项是自定义警告信息(参照antd)，更多项将被忽略
4. fields   (array)   表单字段枚举  #field配置介绍#
5. *modal   (0 | 1)   是否需要展示在modal中，还需研究



##### field配置介绍

1. field   (string)   字段名  **非空**
2. name   (string)   标签名称 
3. widget   (string)   组件名称  **默认Input**
4. type   (string)   类型 **[string, array, number, boolean, object]**
5. enum   (array)   枚举值，一般配合Select，Radio或者CheckBox使用，数组项是数组
   1. 数组的第一项是对应的提交值，第二项是相应的UI文案
6. tips   (string)   自定义文案提示，多用于palaceholder
7. tabs: (array)    支持tab切换设置数组类型的field
8. by   (string)   如果有依赖，定义依赖的field
9. $ref   (string | array)   自定义形状，一般用于数组项的自定义，数组项可以是字符串或者数组
   1. 字符串：对应的ref值
   2. 数组：用于有前后依赖时
10. defaultValue   (string | array | number | boolean | object)   默认值
11. txt   (string)   目前作用还未想好，目前是为了兼容CheckBox和Radio不包含enum的时候
12. *api   (string)   针对有网络请求的Select，Radio或者其他组件的情况
13. *optFields   (array)   命名还需改正，对应接口中的字段
14. *thirdWidget   (string)   第三方组件支持


* 表示有待调整
