import { FormComponentProps } from 'antd/lib/form';

export interface IFormSchema {
  title: string;
  description?: string;
  required?: Array<string | [string, string]>;
  fields: Array<IField>;
  // 针对ref做的hack
  [key: string]: any;
}

export interface IField {
  field: string;
  name?: string;
  defaultValue?: any;
  enum?: Array<[any, string]>;
  type?: 'string' | 'boolean' | 'array' | 'object';
  widget?: string;
  len?: number;
  min?: number;
  max?: number;
  tips?: string;
  tabs?: string[];
  by?: string;
  ref?: string | {[key: string]: string};
  [key: string]: any;
}

export interface IFormItemOption {
  initialValue?: string | number | boolean;
  rules: Array<any>
}

export interface IProps extends FormComponentProps {
  formSchema: IFormSchema;
  callback: (data: any) => void;
  formData?: any;
  submitTxt?: string;
  [key: string]: any;
}