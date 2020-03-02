import React, { useEffect } from 'react';
import { Table, Button, Radio } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { SettingOutlined } from '@ant-design/icons';
import { useModel } from '@tarocch1/use-model';
import { mainModel } from '../../models';
import { IProxyFormData } from '../../types';

function App() {
  const _mainModel = useModel(mainModel);
  const columns: ColumnProps<IProxyFormData>[] = [
    {
      dataIndex: 'name',
    },
    {
      key: 'setting',
      render: (record: IProxyFormData) => <SettingOutlined />,
    },
    {
      key: 'Radio',
      render: (record: IProxyFormData) => (
        <Radio checked={record.id === _mainModel.currentProxy} onClick={() => _mainModel.setCurrentProxy(record.id)} />
      ),
    },
  ];
  useEffect(() => {
    _mainModel.getProxyList();
  }, []);
  return (
    <Table
      size="small"
      columns={columns}
      dataSource={_mainModel.proxyList}
      rowKey="id"
      showHeader={false}
      pagination={false}
      footer={() => (
        <Button type="link" onClick={() => _mainModel.setShowMode('edit')}>
          {chrome.i18n.getMessage('add')}
        </Button>
      )}
      locale={{
        emptyText: chrome.i18n.getMessage('no_data'),
      }}
    />
  );
}

export default App;
