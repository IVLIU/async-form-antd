import React, { FC, FormEvent, ChangeEvent, MouseEvent, useState, useRef, useEffect } from 'react';
import { Form, Button, Icon, Tabs, Input, Divider } from 'antd';
import _ from 'lodash';
import renderAntd from './utils/renderAntd';
import { IProps, IField, IFormItemOption } from './AsyncForm.interface';
import './AsyncForm.less';

const { create, Item: FormItem } = Form;
const { TabPane } = Tabs;

const AsyncForm: FC<IProps> = (props) => {
  // props
  const { formSchema, formData, form, callback, submitTxt } = props;
  const { fields } = formSchema;
  const { getFieldDecorator, validateFields, getFieldValue } = form;
  // state
  const [ isShowButton, setIsShowButton ] = useState<boolean>(false);
  const [ isTabEdit, setIsTabEdit ] = useState<boolean>(false);
  const [ isHaveFormData, setIsHaveFormData ] = useState<boolean>(false);
  const [ renderOfArrayType, setRenderOfArrayType ] = useState<any[][]>([]);
  const [ formatOfArrayType, setFormatOfArrayType ] = useState<string[]>([]);
  const [ tabsFromFormSchema, setTabsFromFormSchema ] = useState<string[]>([]);
  // ref 
  const formatRef = useRef<((currentKey: string) => void) | null>(null);
  const byRef = useRef<string>('');
  const currentTabKeyRef = useRef<number>(0);
  // effects
  useEffect(() => {
    const handleEnterDown = (e: KeyboardEvent) => {
      if(e.keyCode === 13) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown',handleEnterDown);
    () => {
      document.removeEventListener('keydown', handleEnterDown)
    }
  }, []) 
  useEffect(() => {
    if(Object.keys(formData).length>0) {
      if(formatOfArrayType.length>0) {
        if(formatOfArrayType.length === 1) {
          const currentArrayTypeData = formData[formatOfArrayType[0]];
          const currentTabsData = formData.tabs;
          if(Array.isArray(currentArrayTypeData)) {
            const renderOfArrayTypeFromFormData = currentArrayTypeData.reduce((prev, current) => {
              let currentTabArrayTypeData = [];
              if(Array.isArray(current)) {
                currentTabArrayTypeData = current.reduce((prev, _, idx) => {
                  return [...prev, { idx }];
                }, []);
              }
              return [...prev, currentTabArrayTypeData];
            }, []);
            setRenderOfArrayType(renderOfArrayTypeFromFormData);
          }
          if(currentTabsData) {
            setTabsFromFormSchema(currentTabsData);
          }
        }
      }
      setIsHaveFormData(true);
    }
  }, [formatOfArrayType])
  // render empty fields
  if(!fields || fields.length === 0) {
    return (
      <div className="af-empty__wrapper">
        <Icon type="frown" />
        {/* <p>something bad happened.</p> */}
      </div>
    )
  }
  // antd
  const formItemLayout = {
    labelCol: { span: 4 },
    // wrapperCol: { span: 8 },
  };
  const formTailLayout = {
    wrapperCol: { offset: 4 },
  };
  // function definition
  const handleTabStatusEdit: () => void = () => {
    setIsTabEdit(!isTabEdit);
  }
  const handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void = (e) => {
    const tabsFromFormSchemaClone = _.cloneDeep(tabsFromFormSchema);
    tabsFromFormSchemaClone[currentTabKeyRef.current] = e.target.value;
    setTabsFromFormSchema(tabsFromFormSchemaClone);
  }
  const handleTabEdit: (targetKey: string | MouseEvent<HTMLElement>, action: any) => void = (targetKey, action) => {
    const tabsFromFormSchemaClone = _.cloneDeep(tabsFromFormSchema);
    if(action === "add") {
      tabsFromFormSchemaClone.push('新菜单');
      setTabsFromFormSchema(tabsFromFormSchemaClone);
      return;
    }
    if(tabsFromFormSchemaClone.length>1 && action === "remove") {
      const leftTabs = tabsFromFormSchemaClone.slice(0, +targetKey);
      const rightTabs = tabsFromFormSchemaClone.slice(+targetKey+1);
      setTabsFromFormSchema([...leftTabs, ...rightTabs]);
    }
  }
  const handleFormSubmit: (e: FormEvent<any>) => void = (e) => {
    /** TODO： 性能很差，长时间占用主线程，需要做优化 */
    e.preventDefault();
    validateFields(async (err, val) => {
      if(err) {
        return
      }
      if(renderOfArrayType.length===0 || formatOfArrayType.length===0) {
        await callback(val);
        return;
      } 
      if(!formatRef.current) {
        formatRef.current = (cKey) => {
          const reg: RegExp = new RegExp(`^${cKey}_.+`);
          const keys: string[] = Object.keys(val);
          const keysExceptCurrentKey: [string, string][][] = [];
          if(!val[cKey]) {
            val[cKey] = [];
          } 
          keys.forEach((k) => {
            if(reg.test(k)) {
              const fieldSet = k.split('_');
              const subKey: string = fieldSet[1];
              const subIdx: string = fieldSet[2];
              if(!keysExceptCurrentKey[+subIdx]) {
                keysExceptCurrentKey[+subIdx] = [];
              }
              if(subKey) {
                keysExceptCurrentKey[+subIdx].push([k, subKey]);
              }
            }
          })
          renderOfArrayType.forEach((cRenderOfArrayType, idx) => {
            cRenderOfArrayType.forEach((_, subIdx) => {
              if(!val[cKey][idx]) {
                val[cKey][idx] = [];
              }
              val[cKey][idx][subIdx] = keysExceptCurrentKey[idx].reduce((prev, current) => {
                const [k, sk] = current;
                return {[sk]: val[k][subIdx], ...prev};
              }, {});
            })
          })
          keysExceptCurrentKey.forEach((cKeys) => {
            cKeys.forEach((k) => {
              const temporaryKey = k[0];
              if(temporaryKey) {
                delete val[temporaryKey];
              }
            })
          })
        }
      }
      if(formatOfArrayType.length===1) {
        formatRef.current(formatOfArrayType[0]);
        if(tabsFromFormSchema.length>1) {
          val.tabs = tabsFromFormSchema;
        }
        await callback(val);
        formatRef.current = null;
        return;
      }
      formatOfArrayType.forEach((currentKey) => {
        /** todo: 需要多个数据处理的问题 */
        if(formatRef.current) {
          formatRef.current(currentKey);
        }
      })
      if(tabsFromFormSchema.length>1) {
        val.tabs = tabsFromFormSchema;
      }
      await callback(val);
      formatRef.current = null;
    })
  };
  const handleCurrentTabKeyChange: (currentKey: string) => void = (cKey) => {
    currentTabKeyRef.current = +cKey;
  }
  const handleArrayItemAdd: () => void = () => {
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    const currentTabKey = currentTabKeyRef.current;
    if(!renderOfArrayTypeClone[currentTabKey]) {
      renderOfArrayTypeClone[currentTabKey] = [];
    }
    const initialArrayObj = { idx: renderOfArrayTypeClone[currentTabKey].length};
    renderOfArrayTypeClone[currentTabKey].push(initialArrayObj);
    setRenderOfArrayType(renderOfArrayTypeClone);
  }
  const handleArrayItemUp:(upIdx: number) => void = (uIdx) => {
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    const currentTabrenderOfArrayType = renderOfArrayTypeClone[currentTabKeyRef.current];
    const temporaryArrayTypeItem = currentTabrenderOfArrayType[uIdx];
    currentTabrenderOfArrayType[uIdx] = currentTabrenderOfArrayType[uIdx-1];
    currentTabrenderOfArrayType[uIdx-1] = temporaryArrayTypeItem;
    renderOfArrayTypeClone[currentTabKeyRef.current] = currentTabrenderOfArrayType;
    setRenderOfArrayType(renderOfArrayTypeClone);
  }
  const handleArrayItemDowm:(downIdx: number) => void = (dIdx) => {
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    const currentTabrenderOfArrayType = renderOfArrayTypeClone[currentTabKeyRef.current];
    const temporaryArrayTypeItem = currentTabrenderOfArrayType[dIdx];
    currentTabrenderOfArrayType[dIdx] = currentTabrenderOfArrayType[dIdx+1];
    currentTabrenderOfArrayType[dIdx+1] = temporaryArrayTypeItem;
    renderOfArrayTypeClone[currentTabKeyRef.current] = currentTabrenderOfArrayType;
    setRenderOfArrayType(renderOfArrayTypeClone);
  }
  const handleArrayItemDelete : (deleteIdx: number) => void = (dIdx) => {
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    const currentTabKey = currentTabKeyRef.current;
    if(renderOfArrayType[currentTabKey].length===1) {
      renderOfArrayTypeClone[currentTabKey] = [];
      setRenderOfArrayType(renderOfArrayTypeClone);
      return;
    }
    const left = renderOfArrayTypeClone[currentTabKey].slice(0, dIdx);
    const right = renderOfArrayTypeClone[currentTabKey].slice(dIdx+1);
    renderOfArrayTypeClone[currentTabKey] = [...left, ...right];
    setRenderOfArrayType(renderOfArrayTypeClone);
  }
  const handleFormItemOptionFormat: (field: IField, currentFormItemField: string, tabIndex?: number, arrayIndex?: number, type?: string) => IFormItemOption = (f, cField, tIdx, aIdx, type) => {
    const { field, name, defaultValue } = f;
    const { required } = formSchema;
    let initialValue: undefined | string = undefined;
    const baseOpt: IFormItemOption = {
      rules: [],
    };
    if(defaultValue) {
      initialValue = defaultValue;
    }
    if(formData[cField] && isHaveFormData) {
      initialValue = formData[cField];
    }
    if(type && type === "array" && isHaveFormData) {
      if(formatOfArrayType.length>0) {
        const currentTabFormData = formData[formatOfArrayType[0]][tIdx as number];
        if(currentTabFormData) {
          const currentFromData = currentTabFormData[aIdx as number];
          if(currentFromData) {
            initialValue = currentFromData[field];
          }
        }
      }
    }
    baseOpt.initialValue = initialValue;
    if(required && required.indexOf(field) !== -1) {
      baseOpt.rules.push({
        required: true,
        message: `${name || '该字段'}不能为空`,
      });
    }
    return baseOpt;
  }
  const handleFormRender: (
    fieldsParam: IField[], 
    arrayType?: boolean,
    arrayTypeOption?: {
      tabIdx?: number,
      arrayIdx: number,
      superField: string,
    }
  ) => JSX.Element = (fp, aType=false, atOpt={tabIdx: 0, arrayIdx: 0, superField: ''}) => {
    return (
      <>
        {fp.map((f, idx) => {
          const { 
            field, name, type, tabs,
          } = f;
          let formItemField = field;
          let formItemFieldOption = handleFormItemOptionFormat(f, formItemField);
          if(type === "array") {
            if(!isShowButton) {
              setIsShowButton(true);
            }
            if(formatOfArrayType.indexOf(field) === -1) {
              // 过度设计，当前交互下仅支持一个类型为array的field
              setFormatOfArrayType([...formatOfArrayType, field]);
            }
            if(tabs && tabsFromFormSchema.length === 0) {
              setTabsFromFormSchema(tabs);
            }
            return (
              <div className="af-array__wrapper" key={idx}>
                <div>
                  {tabsFromFormSchema.length>0 ? (
                    <FormItem key="tabs" {...formTailLayout}>
                      <Tabs 
                        type="editable-card"
                        onChange={(key) => handleCurrentTabKeyChange(key)}
                        onEdit={handleTabEdit}
                      >
                        {tabsFromFormSchema.map((tab, idxOfTab) => {
                          let currentTab = <span onDoubleClick={handleTabStatusEdit}>{tab}</span>
                          if(currentTabKeyRef.current === idxOfTab && isTabEdit) {
                            currentTab = (
                              <Input 
                                autoFocus={true} 
                                value={tabsFromFormSchema[currentTabKeyRef.current]} 
                                onBlur={handleTabStatusEdit} 
                                onChange={(e) => handleInputChange(e)}
                                style={{width: 60}} 
                              />
                            )
                          }
                          return (
                            <TabPane key={`${idxOfTab}`} tab={currentTab}>
                              {renderOfArrayType[idxOfTab] ? renderOfArrayType[idxOfTab] && Array.isArray(renderOfArrayType[idxOfTab]) && renderOfArrayType[idxOfTab].map((aItem, idxOfRenderArrayType) => {
                                const { by, ref: $ref } = f;
                                let byVal: string = '';
                                let $refVal: string = '';
                                if(typeof $ref === "string") {
                                  $refVal = $ref;
                                }
                                if(typeof by === "string") {
                                  byVal = getFieldValue(by);
                                  if(typeof $ref === "object") {
                                    $refVal = $ref[byVal];
                                    byRef.current = $refVal;
                                  }
                                }
                                return (
                                  <FormItem key={`${idxOfTab}_${idxOfRenderArrayType}`}>
                                    <div className="af-array__item">
                                      {getFieldDecorator(field)(
                                        handleFormRender(
                                          formSchema[$refVal],  
                                          true, 
                                          {tabIdx: idxOfTab, arrayIdx: aItem.idx, superField: field}
                                        )
                                      )}
                                      <div className="af-operation">
                                        {idxOfRenderArrayType>0 && (
                                          <>
                                            <Icon type="arrow-up" onClick={() => handleArrayItemUp(idxOfRenderArrayType)} />
                                            <Divider type="vertical" />
                                          </>
                                        )}
                                        {renderOfArrayType[currentTabKeyRef.current] && idxOfRenderArrayType<renderOfArrayType[currentTabKeyRef.current].length-1 && (
                                          <>
                                            <Icon type="arrow-down" onClick={() => handleArrayItemDowm(idxOfRenderArrayType)} />
                                            <Divider type="vertical" />
                                          </>
                                        )}
                                        <Icon type="delete" onClick={() => handleArrayItemDelete(idxOfRenderArrayType)} />
                                      </div>
                                    </div>
                                  </FormItem>
                                )
                              }) : (
                                <div className="af-empty">暂无数据</div>
                              )}
                            </TabPane>
                          )
                        })}
                      </Tabs>
                    </FormItem>
                  ) : (
                    <>
                      {renderOfArrayType[0] && Array.isArray(renderOfArrayType[0]) && renderOfArrayType[0].map((aItem, idxOfRenderArrayType) => {
                        const { by, ref: $ref } = f;
                        let byVal: string = '';
                        let $refVal: string = '';
                        if(typeof $ref === "string") {
                          $refVal = $ref;
                        }
                        if(typeof by === "string") {
                          byVal = getFieldValue(by);
                          if(typeof $ref === "object") {
                            $refVal = $ref[byVal];
                            byRef.current = $refVal;
                          }
                        }
                        return (
                          <FormItem key={idxOfRenderArrayType} {...formTailLayout}>
                            <div className="af-array__item">
                              {getFieldDecorator(field)(
                                handleFormRender(
                                  formSchema[$refVal],
                                  true, 
                                  {tabIdx: 0, arrayIdx: aItem.idx, superField: field}
                                )
                              )}
                              <div className="af-operation">
                                {idxOfRenderArrayType>0 && (
                                  <>
                                    <Icon type="arrow-up" onClick={() => handleArrayItemUp(idxOfRenderArrayType)} />
                                    <Divider type="vertical" />
                                  </>
                                )}
                                {renderOfArrayType[currentTabKeyRef.current] && idxOfRenderArrayType<renderOfArrayType[0].length-1 && (
                                  <>
                                    <Icon type="arrow-down" onClick={() => handleArrayItemDowm(idxOfRenderArrayType)} />
                                    <Divider type="vertical" />
                                  </>
                                )}
                                <Icon type="delete" onClick={() => handleArrayItemDelete(idxOfRenderArrayType)} />
                              </div>
                            </div>
                          </FormItem>
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
            )
          }
          if(aType) {
            const { tabIdx, arrayIdx, superField} = atOpt;
            formItemField = `${superField}_${formItemField}_${tabIdx}[${arrayIdx}]`;
            formItemFieldOption = handleFormItemOptionFormat(f, formItemField, tabIdx, arrayIdx, "array");
          }
          return (
            <FormItem key={idx} label={name} {...formItemLayout}>
              {getFieldDecorator(formItemField, formItemFieldOption)(
                renderAntd(f)
              )}
            </FormItem>
          )
        })}
      </>
    )
  };
  // render mormal fields
  return (
    <div className="af-wrapper">
      {/** title或者description的展示 */}
      <Form onSubmit={e => handleFormSubmit(e)}>
        {handleFormRender(fields)}
        <FormItem {...formTailLayout}>
          {isShowButton && <Button className="af-add__button" onClick={handleArrayItemAdd}>添加模块</Button>}
          <Button type="primary" htmlType="submit">{submitTxt || "提交"}</Button>
        </FormItem>
      </Form>
    </div>
  )
};

const AsyncFormWrappedByAntdForm = create({})(AsyncForm);

export default AsyncFormWrappedByAntdForm;