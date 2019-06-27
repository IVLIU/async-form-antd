import React from 'react';
import { Input, Radio, Select, Checkbox } from 'antd';
import ev from './subscribe';
import { IField } from '../AsyncForm.interface';

const { Group: RadioGroup } = Radio;
const { Option: SelectOption } = Select;
const { Group: CheckboxGroup } = Checkbox;

const handleRadioAndSelectChange: () => void = () => {
  ev.emit('edit')
}

export const renderAntd: (field: IField,isShowItem:string) => JSX.Element | null | undefined = (f,isShowItem) => {
  const { name, widget, tips, enum: enumLike } = f;
  if (!widget) {
    if(f.field === "doctorIds" || f.field === "title"){
      return <Input style={{width: 400}} placeholder={tips || `请输入${name}`} />;
    }
    return <Input style={{width: 400,display:isShowItem}} placeholder={tips || `请输入${name}`} />;
  }
  switch (widget) {
    case 'Radio':
      if (!enumLike) {
        throw new Error('enum is not define.');
      }
      return (
        <RadioGroup onChange={handleRadioAndSelectChange}> 
          {enumLike.map((el: [any, string], idx: number) => {
            const [val, txt] = el;
            return (
              <Radio key={idx} value={val}>
                {txt}
              </Radio>
            );
          })}
        </RadioGroup>
      );
    case 'Select':
      if (!enumLike) {
        throw new Error('enum is not define.');
      }
      return (
        <Select 
          style={{ width: 400 }} 
          placeholder={tips || `请输入${name}`} 
          onChange={handleRadioAndSelectChange}
        >
          {enumLike.map((el: [any, string], idx: number) => {
            const [val, txt] = el;
            return (
              <SelectOption key={idx} value={val}>
                {txt}
              </SelectOption>
            )
          })}
        </Select>
      );
    case 'TextArea':
      return <Input style={{ width: 400, display:isShowItem}} placeholder={tips || `请输入${name}`} />
    case 'Checkbox':
      if (!enumLike) {
        throw new Error('enum is not define.');
      }
      const options = enumLike.reduce((prev, current) => {
        const [ value, label ] = current;
        return [...prev, {label, value}];
      }, [] as {label: string, value: string}[]);
      return <CheckboxGroup options={options} />
    default:
      return <Input style={{ width: 400 }} placeholder={tips || `请输入内容`} />
  }
};

export default renderAntd;
