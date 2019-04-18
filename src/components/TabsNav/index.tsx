import React, { FC, useState, useEffect, useRef } from 'react';
import className from 'classnames';
import { Icon, Divider, Tabs } from 'antd';
import { IProps } from './index.interface';
import './index.less';

const { TabPane } = Tabs;

const TabsNav: FC<IProps> = (props) => {
  // props
  const { tabs, onKeyChange, currentKeyAndChildren } = props;
  const { currentKeyFormSuperComponent, currentChildren } = currentKeyAndChildren;
  // function definition
  const handleCurrentKeyChange: (currentStringKey: string) => void = (cStrKey) => {
    onKeyChange(Number(cStrKey));
  }
  return (
    <Tabs defaultActiveKey="0" onChange={(k) => handleCurrentKeyChange(k)}>
      {tabs.map((tab, idx) => {
        return (
          <TabPane tab={tab} key={`${idx}`}>
            {currentKeyFormSuperComponent === idx && currentChildren}
          </TabPane>
        )
      })}
    </Tabs>
  )
};

export default TabsNav;