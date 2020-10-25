import React from 'react';
import { ScreenerStatus, IProviderProps } from '../api';
import { Tag, Tooltip } from 'antd';

const renderStatus = (context: IProviderProps) => {
  if (context.status === ScreenerStatus.ONLINE) {
    return (
      <Tooltip
        title="Du bist mit dem Backend verbunden und bekommst Live updates."
        placement="left"
      >
        <Tag color="green">Live</Tag>
      </Tooltip>
    );
  }
  if (context.status === ScreenerStatus.OFFLINE) {
    return (
      <Tooltip
        title="Deine Verbindung ist abgebrochen. Bitte lade die Seite neu!"
        placement="left"
      >
        <Tag color="red">Offline</Tag>
      </Tooltip>
    );
  }
  if (context.status === ScreenerStatus.RECONNECTING) {
    return (
      <Tooltip
        title="Deine Verbindung wird wiederhergestellt."
        placement="left"
      >
        <Tag color="orange">Reconnecting...</Tag>
      </Tooltip>
    );
  }
};

export default renderStatus;
