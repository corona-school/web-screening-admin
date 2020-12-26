import React, { useContext } from 'react';
import { Badge, Typography, Divider } from 'antd';
import { ApiContext } from '../api/ApiContext';

import './ScreenerList.less';

const { Text, Title } = Typography;

const ScreenerList = () => {
  const context = useContext(ApiContext);

  return (
    <div className="screenerList">
      <Title style={{ color: '#6c757d', marginTop: 0 }} level={4}>
        Screener Online
      </Title>
      {context?.screenerOnline.map((screener) => {
        return [
          <div className="item" key={screener.email}>
            <Badge color="green" style={{ margin: '1px' }} />
            <div className="itemText">
              <Text className="name">
                {screener.firstname} {screener.lastname}
              </Text>
              <Text className="secondary" type="secondary">
                {screener.email}
              </Text>
            </div>
          </div>,
          <Divider
            key={screener.email + '-divider'}
            style={{ margin: '8px 0px' }}
          />,
        ];
      })}
    </div>
  );
};

export default ScreenerList;
