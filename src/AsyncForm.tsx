import React, { FC, FormEvent, MouseEvent, useState, useRef, useEffect } from 'react';
import { Form, Button, Icon, Tabs, Input, Divider, Modal , message} from 'antd';
import _ from 'lodash';
import renderAntd from './utils/renderAntd';
import ev from './utils/subscribe';
import { IProps, IField, IFormItemOption } from './AsyncForm.interface';
import './AsyncForm.less';

const { create, Item: FormItem } = Form;
const { TabPane } = Tabs;
// 折叠点击判断
let collapseBoolean = false;

const AsyncForm: FC<IProps> = (props) => {  
  // props
  const { formSchema, formData, form, callback, callbackOfEdit, submitTxt } = props;
  const { fields } = formSchema;
  const { getFieldDecorator, validateFields, getFieldValue } = form;
  // state
  const [ isShowItem, setIsShowItem] = useState<string>("block")
  const [ isShowButton, setIsShowButton ] = useState<boolean>(false);
  const [ isEdit, setIsEdit ] = useState<boolean>(false);
  const [ isTabEdit, setIsTabEdit ] = useState<boolean>(false);
  const [ isHaveFormData, setIsHaveFormData ] = useState<boolean>(false);
  const [ renderOfArrayType, setRenderOfArrayType ] = useState<any[][]>([]);
  const [ formatOfArrayType, setFormatOfArrayType ] = useState<string[]>([]);
  const [ tabsActiveKey, setTabsActiveKey ] = useState<number>(0);
  const [ tabsFromFormSchema, setTabsFromFormSchema ] = useState<Array<{title: string, key: number}>>([]);
  // ref 
  const formatRef = useRef<((currentKey: string) => void) | null>(null);
  const byRef = useRef<string>('');
  const currentTabKeyRef = useRef<number>(0);
  const inputRef = useRef<Input>(null);
  const afWrapperRef = useRef<HTMLDivElement>(null);
  const renderOfArrayItemKeyRef = useRef<number[]>([]);
  const isEditCallbackRef = useRef<() => void>(() => {
    if(!isEdit) {
      setIsEdit(true);
    }
  })
  /** NOTE: 维持当前tabs的最大key值 */
  const maxKeyRef = useRef<number>(0);
  // effects
  useEffect(() => {
    const handleEnterDown = (e: KeyboardEvent) => {
      if(document.activeElement!.tagName==='INPUT') {
        if(afWrapperRef.current!.contains(document.activeElement!)) {
          isEditCallbackRef.current();
        }
      }
      if(e.keyCode===13) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown',handleEnterDown);
    ev.once('edit', () => {
      isEditCallbackRef.current();
    });
    return () => {
      document.removeEventListener('keydown', handleEnterDown)
    }
  }, []) 
  useEffect(() => {
    if(isEdit) {
      if(callbackOfEdit) {
        callbackOfEdit();
      }
    }
  }, [isEdit]);
  useEffect(() => {
    if(Object.keys(formData).length>0) {
      if(formatOfArrayType.length>0) {
        if(formatOfArrayType.length===1) {
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
            renderOfArrayItemKeyRef.current = currentArrayTypeData.reduce((prev, current) => {
              if(current && Array.isArray(current)) {
                return [...prev, current.length];
              }
              return [...prev, 0];
            }, []);
            setRenderOfArrayType(renderOfArrayTypeFromFormData);
          }
          if(currentTabsData) {
            setTabsFromFormSchema(currentTabsData);
            maxKeyRef.current = currentTabsData.length;
          }
        }
      }
      setIsHaveFormData(true);
    }
  }, [formatOfArrayType])
  // render empty fields
  if(!fields || fields.length===0) {
    return null;
  }
  // antd
  const formItemLayout = {
    labelCol: { span: 4 },
    // wrapperCol: { span: 8 },
  };
  const formTailLayout = {
    wrapperCol: { offset: 4 },
  };
  // 配置消息提示信息
  message.config({
    top: 100,
    duration: 2,
    maxCount: 1,
  });
  // function definition
  const handleTabStatusEdit: () => void = () => {
    const tabsFromFormSchemaClone = _.cloneDeep(tabsFromFormSchema);
    if(inputRef.current) {
      tabsFromFormSchemaClone[currentTabKeyRef.current].title = inputRef.current.state.value;
      setTabsFromFormSchema(tabsFromFormSchemaClone);
    }
    setIsTabEdit(!isTabEdit);
    isEditCallbackRef.current();
  }
  const handlerAddTabPane:() => void = () => {
    const tabsFromFormSchemaClone = _.cloneDeep(tabsFromFormSchema);
    tabsFromFormSchemaClone.push({
      title:"新菜单",
      key:maxKeyRef.current
    });
    maxKeyRef.current = maxKeyRef.current+1;
    setTabsFromFormSchema(tabsFromFormSchemaClone);
    isEditCallbackRef.current();
  }
  const swapArray:(arr:any, index1:number, index2:number) => any[] = (arr,index1,index2) => {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  }
  const handlerLeftMoveTabPane:() => void = () => {
    const tabsFromFormSchemaClone = _.cloneDeep(tabsFromFormSchema);
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    if(+tabsActiveKey - 1<0) {
      message.info('已经到底了')
      return
    }
    const newTabsFromFormSchemaClone = swapArray(tabsFromFormSchemaClone,+tabsActiveKey,+tabsActiveKey - 1);
    const newRenderOfArrayTypeClone = swapArray(renderOfArrayTypeClone,+tabsActiveKey,+tabsActiveKey - 1);
    setTabsFromFormSchema(newTabsFromFormSchemaClone);
    setRenderOfArrayType(newRenderOfArrayTypeClone);
    setTabsActiveKey(+tabsActiveKey - 1);
    isEditCallbackRef.current();
  }
  const handlerRightMoveTabPane:() => void = () => {
    const tabsFromFormSchemaClone = _.cloneDeep(tabsFromFormSchema);
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    if(+tabsActiveKey + 1>tabsFromFormSchemaClone.length - 1){
      message.info('已经到底了')
      return
    }
    const newTabsFromFormSchemaClone = swapArray(tabsFromFormSchemaClone,+tabsActiveKey,+tabsActiveKey + 1);
    const newRenderOfArrayTypeClone = swapArray(renderOfArrayTypeClone,+tabsActiveKey,+tabsActiveKey + 1);
    setTabsFromFormSchema(newTabsFromFormSchemaClone);
    setRenderOfArrayType(newRenderOfArrayTypeClone);
    setTabsActiveKey(+tabsActiveKey + 1);
    isEditCallbackRef.current();
  }
  const handleTabEdit: (targetKey: string | MouseEvent<HTMLElement>, action: any) => void = (targetKey, action) => {
    const tabsFromFormSchemaClone = _.cloneDeep(tabsFromFormSchema);
    if(tabsFromFormSchemaClone.length>2 && action==="remove") {
      Modal.confirm({
        title: '删除确认',
        content: '是否删除该项？',
        okText: "确定",
        cancelText: '取消',
        onOk: () => {
          const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
          const leftRenderOfArrayType = renderOfArrayTypeClone.slice(0, +targetKey);
          const rightRenderOfArrayType = renderOfArrayTypeClone.slice(+targetKey+1);
          const leftTabs = tabsFromFormSchemaClone.slice(0, +targetKey);
          const rightTabs = tabsFromFormSchemaClone.slice(+targetKey+1);
          setTabsFromFormSchema([...leftTabs, ...rightTabs]);
          setRenderOfArrayType([...leftRenderOfArrayType, ...rightRenderOfArrayType]);
          isEditCallbackRef.current();
        }
      });
    }
  }
  const handleFormSubmit: (e: FormEvent<any>) => void = (e) => {
    e.preventDefault();
    validateFields(async (err, val) => {
      if(err) {
        return
      }
      if(renderOfArrayType.length===0 || formatOfArrayType.length===0) {
        await callback(val);
        return;
      } 
      if(!renderOfArrayType.every((rItem) => rItem.length>0)) {
        message.warn('菜单栏的数据不能为空');
        return;
      }
      if(!formatRef.current) {
        formatRef.current = (cKey) => {
          const reg: RegExp = new RegExp(`^${cKey}_.+`);
          const keys: string[] = Object.keys(val);
          let keysExceptCurrentKey: [string, string][][] = [];
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
          keysExceptCurrentKey = keysExceptCurrentKey.filter(Boolean);
          renderOfArrayType.forEach((cRenderOfArrayType, idx) => {
            let idxOfkey = idx;
            if(tabsFromFormSchema.length>0) {
              idxOfkey = tabsFromFormSchema[idx].key;
            }
            cRenderOfArrayType.forEach((cAType, cAIdx) => {
              let { idx: subIdx } = cAType;
              if(!val[cKey][idx]) {
                val[cKey][idx] = [];
              }
              val[cKey][idx][subIdx] = keysExceptCurrentKey[idxOfkey].reduce((prev, current) => {
                const [k, sk] = current;
                /** NOTE: antd删除数组会将数组项置为empty，过滤以规避该问题 */
                const valArrayKeyWithoutEmpty = val[k].filter(Boolean);
                return {[sk]: valArrayKeyWithoutEmpty[cAIdx], ...prev};
              }, {});
            })
            if(!val[cKey][idx]) {
              val[cKey][idx] = [];
            }
            val[cKey][idx] = val[cKey][idx].filter(Boolean);
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
          /** NOTE: 可以消除tabKey移位后设置initialValue和后续移动错乱的问题 */
          val.tabs = tabsFromFormSchema.reduce((prev, current, idx) => {
            return [...prev, {...current, key: idx}];
          }, [] as Array<{title: string, key: number}>)
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
      setIsEdit(false);
    })
  };
  const handleCurrentTabKeyChange: (currentKey: string) => void = (cKey) => {
    setTabsActiveKey(+cKey)
    currentTabKeyRef.current = +cKey;
  }
  const handleCollapseTtem:() => void = () => {
    collapseBoolean = !collapseBoolean;
    collapseBoolean ? setIsShowItem("none") : setIsShowItem("block");
  }
  const handleArrayItemAdd: () => void = () => {
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    const currentTabKey = currentTabKeyRef.current;
    collapseBoolean = false;
    if(!renderOfArrayTypeClone[currentTabKey]) {
      renderOfArrayTypeClone[currentTabKey] = [];
    }
    if(!renderOfArrayItemKeyRef.current[currentTabKey]) {
      renderOfArrayItemKeyRef.current[currentTabKey] = 0;
    }
    const initialArrayObj = { idx: renderOfArrayItemKeyRef.current[currentTabKey]};
    renderOfArrayItemKeyRef.current[currentTabKey] = renderOfArrayItemKeyRef.current[currentTabKey]+1;
    renderOfArrayTypeClone[currentTabKey].push(initialArrayObj);
    setRenderOfArrayType(renderOfArrayTypeClone);
    setIsShowItem("block");
    isEditCallbackRef.current();
  }
  const handleArrayItemUp:(upIdx: number) => void = (uIdx) => {
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    const currentTabrenderOfArrayType = renderOfArrayTypeClone[currentTabKeyRef.current];
    const temporaryArrayTypeItem = currentTabrenderOfArrayType[uIdx];
    currentTabrenderOfArrayType[uIdx] = currentTabrenderOfArrayType[uIdx-1];
    currentTabrenderOfArrayType[uIdx-1] = temporaryArrayTypeItem;
    renderOfArrayTypeClone[currentTabKeyRef.current] = currentTabrenderOfArrayType;
    setRenderOfArrayType(renderOfArrayTypeClone);
    isEditCallbackRef.current();
    message.success("上移成功")
  }
  const handleArrayItemDowm:(downIdx: number) => void = (dIdx) => {
    const renderOfArrayTypeClone = _.cloneDeep(renderOfArrayType);
    const currentTabrenderOfArrayType = renderOfArrayTypeClone[currentTabKeyRef.current];
    const temporaryArrayTypeItem = currentTabrenderOfArrayType[dIdx];
    currentTabrenderOfArrayType[dIdx] = currentTabrenderOfArrayType[dIdx+1];
    currentTabrenderOfArrayType[dIdx+1] = temporaryArrayTypeItem;
    renderOfArrayTypeClone[currentTabKeyRef.current] = currentTabrenderOfArrayType;
    setRenderOfArrayType(renderOfArrayTypeClone);
    isEditCallbackRef.current();
    message.success("下移成功")
  }
  const handleArrayItemDelete : (deleteIdx: number) => void = (dIdx) => {
    Modal.confirm({
      title: '删除确认',
      content: '是否删除该项？',
      okText: "确定",
      cancelText: '取消',
      onOk: () => {
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
        isEditCallbackRef.current();
        message.success("删除成功");
      }
    })
  }
  const handleFormItemOptionFormat: (field: IField, currentFormItemField: string, tabKey?: number, arrayIndex?: number, type?: string) => IFormItemOption = (f, cField, tKey, aIdx, type) => {
    const { field, name, defaultValue } = f;
    const { required } = formSchema;
    let initialValue: undefined | string = undefined; 
    const baseOpt: IFormItemOption = {
      rules: [],
    };
    if(defaultValue) { 
      initialValue = defaultValue;
    }
    if((formData[cField] || formData[cField]===0) && isHaveFormData) {
      initialValue = formData[cField];
    }
    if(type && type==="array" && isHaveFormData) {
      if(formatOfArrayType.length>0) {
        const currentTabFormData = formData[formatOfArrayType[0]] && formData[formatOfArrayType[0]][tKey as number];
        if(currentTabFormData) {
          const currentFromData = currentTabFormData[aIdx as number];
          if(currentFromData) {
            initialValue = currentFromData[field];
          }
        }
      }
    }
    baseOpt.initialValue = initialValue;
    if(required && required.indexOf(field)!==-1) {
      baseOpt.rules.push({
        required: true,
        message: `${name || '该字段'}不能为空`,
      });
    }
    return baseOpt;
  }
  /** NOTE: 因为样式问题暂未应用 */
  const handleArrayItemRender: (
    filedParam: IField,
    keyOfTab?: number, 
    indexOfTab?: number,
  ) => JSX.Element = (f, kOfTab=0, idxOfTab=0) => {
    if(!renderOfArrayType[idxOfTab]) {
      renderOfArrayType[idxOfTab] = [];
    }
    if(renderOfArrayType[idxOfTab].length===0) {
      return <div className="af-empty">暂无数据</div>;
    }
    return (
      <>
        {renderOfArrayType[idxOfTab].map((aItem, idxOfRenderArrayType) => {
          const { field, by, ref: $ref } = f;
          let byVal: string = '';
          let $refVal: string = '';
          if(typeof $ref==="string") {
            $refVal = $ref;
          }
          if(typeof by==="string") {
            byVal = getFieldValue(by);
            if(typeof $ref==="object") {
              $refVal = $ref[byVal];
              byRef.current = $refVal;
            }
          }
          return (
            <FormItem key={idxOfRenderArrayType} {...formTailLayout}>
              <div className={isShowItem === "block" ? "af-array__item" : "af-array__itemShow"}>
                {getFieldDecorator(field)(
                  handleFormRender(
                    formSchema[$refVal],
                    true, 
                    {tabKey: kOfTab, arrayIdx: aItem.idx, superField: field}
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
        })}
      </>
    )
  }
  const handleFormRender: (
    fieldsParam: IField[], 
    arrayType?: boolean,
    arrayTypeOption?: {
      tabKey?: number,
      arrayIdx: number,
      superField: string,
    }
  ) => JSX.Element = (fp, aType=false, atOpt={tabKey: 0, arrayIdx: 0, superField: ''}) => {
    return (
      <>
        {fp.map((f, idx) => {
          const { 
            field, name, type, tabs,
          } = f;
          let formItemField = field;
          let formItemFieldOption = handleFormItemOptionFormat(f, formItemField);
          const operations = (
            <div>
              <Icon type="plus" onClick={() => handlerAddTabPane()} style={{marginLeft:20}}/> 
              <Icon type="double-left" style={{marginLeft:10,marginRight:10}} onClick={() => handlerLeftMoveTabPane()} />
              <Icon type="double-right" onClick={() => handlerRightMoveTabPane()}/>   
            </div>
          );
          if(type==="array") {
            if(!isShowButton) {
              setIsShowButton(true);
            }
            if(formatOfArrayType.indexOf(field)===-1) {
              // 过度设计，当前交互下仅支持一个类型为array的field
              setFormatOfArrayType([...formatOfArrayType, field]);
            }
            if(tabs && tabsFromFormSchema.length===0) {
              setTabsFromFormSchema(tabs);
              maxKeyRef.current = tabs.length;
            }
            return (
              <div className="af-array__wrapper" key={idx}>
                <div>
                  {tabsFromFormSchema.length>0 ? (
                    <FormItem key="tabs" {...formTailLayout}>
                      <Tabs 
                        hideAdd
                        type="editable-card"
                        onChange={(key) => handleCurrentTabKeyChange(key)}
                        onEdit={handleTabEdit}
                        tabBarStyle={{width:510}}
                        tabBarExtraContent={operations}
                        activeKey={tabsActiveKey + ""}
                      >
                        {tabsFromFormSchema.map(({ title, key }, idxOfTab) => {
                          if(title.length===0) {
                            return null;
                          }
                          let currentTab = <span onDoubleClick={handleTabStatusEdit}>{title}</span>
                          if(currentTabKeyRef.current===idxOfTab && isTabEdit) {
                            currentTab = (
                              <Input 
                                ref={inputRef}
                                autoFocus={true} 
                                defaultValue={title}
                                onBlur={handleTabStatusEdit} 
                                style={{width: 60}} 
                              />
                            )
                          }
                          if(!renderOfArrayType[idxOfTab]) {
                            renderOfArrayType[idxOfTab] = []
                          }
                          return (
                            <TabPane key={`${idxOfTab}`} tab={currentTab}>
                              {renderOfArrayType[idxOfTab].length>0 ? renderOfArrayType[idxOfTab] && Array.isArray(renderOfArrayType[idxOfTab]) && renderOfArrayType[idxOfTab].map((aItem, idxOfRenderArrayType) => {
                                const { by, ref: $ref } = f;
                                let byVal: string = '';
                                let $refVal: string = '';
                                if(typeof $ref==="string") {
                                  $refVal = $ref;
                                }
                                if(typeof by==="string") {
                                  byVal = getFieldValue(by);
                                  if(typeof $ref==="object") {
                                    $refVal = $ref[byVal];
                                    byRef.current = $refVal;
                                  }
                                }
                                return (
                                  <FormItem key={`${idxOfTab}_${idxOfRenderArrayType}`}>
                                    {/* 通过判断isshowItem来改变class名，从而动态修改样式  */}
                                    <div className={isShowItem === "block" ? "af-array__item" : "af-array__itemShow"}>
                                      {getFieldDecorator(field)(
                                        handleFormRender(
                                          formSchema[$refVal],  
                                          true, 
                                          /** NOTE: 维持tabIdx的不变性 */
                                          {tabKey: key, arrayIdx: aItem.idx, superField: field}
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
                        const { field, by, ref: $ref } = f;
                        let byVal: string = '';
                        let $refVal: string = '';
                        if(typeof $ref==="string") {
                          $refVal = $ref;
                        }
                        if(typeof by==="string") {
                          byVal = getFieldValue(by);
                          if(typeof $ref==="object") {
                            $refVal = $ref[byVal];
                            byRef.current = $refVal;
                          }
                        }
                        return (
                          <FormItem key={idxOfRenderArrayType} {...formTailLayout}>
                            <div className={isShowItem === "block" ? "af-array__item" : "af-array__itemShow"}>
                              {getFieldDecorator(field)(
                                handleFormRender(
                                  formSchema[$refVal],
                                  true, 
                                  {tabKey: 0, arrayIdx: aItem.idx, superField: field}
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
                      })}
                    </>
                  )}
                </div>
              </div>
            )
          }
          if(aType) {
            const { tabKey, arrayIdx, superField} = atOpt;
            formItemField = `${superField}_${formItemField}_${tabKey}[${arrayIdx}]`;
            formItemFieldOption = handleFormItemOptionFormat(f, formItemField, tabKey, arrayIdx, "array");
          }
          return (
            <FormItem key={idx} label={name} {...formItemLayout}>
              {getFieldDecorator(formItemField, formItemFieldOption)(
                renderAntd(f,isShowItem) 
              )}
            </FormItem>
          )
        })}
      </>
    )
  };
  // render mormal fields
  return (
    <div className="af-wrapper" ref={afWrapperRef}>
      {/** title或者description的展示 */}
      <Form onSubmit={e => handleFormSubmit(e)}>
        {handleFormRender(fields)}
        <FormItem {...formTailLayout}>
          {isShowButton && <Button className="af-button" onClick={handleArrayItemAdd}>添加模块</Button>}
          {isShowButton && renderOfArrayType.length>0 && <Button className="af-button" onClick={handleCollapseTtem}>{isShowItem === "block" ? "折叠模块" : "展开模块"}</Button>}
          <Button type="primary" htmlType="submit">{submitTxt || "保存模块"}</Button>
        </FormItem>
      </Form>
    </div>
  )
};

const AsyncFormWrappedByAntdForm = create({})(AsyncForm);

export default AsyncFormWrappedByAntdForm;
