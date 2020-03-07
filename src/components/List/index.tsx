import React, { useEffect } from 'react';
import { Table, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { SettingOutlined } from '@ant-design/icons';
import { useModel } from '@tarocch1/use-model';
import { MainModel } from '../../models';
import { IProxyFormData } from '../../types';

function App() {
  const mainModel = useModel(MainModel);
  const columns: ColumnProps<IProxyFormData>[] = [
    {
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      key: 'setting',
      render: (record: IProxyFormData) => (
        <SettingOutlined style={{ cursor: 'pointer' }} onClick={() => edit(record)} />
      ),
      width: 40,
    },
  ];
  const edit = (data: IProxyFormData) => {
    mainModel.setEdittingProxy(data);
    mainModel.setShowMode('edit');
  };
  useEffect(() => {
    mainModel.getProxyList();
    mainModel.getCurrentProxy();
  }, []);
  return (
    <Table
      size="middle"
      columns={columns}
      dataSource={mainModel.proxyList}
      rowKey="id"
      showHeader={false}
      pagination={false}
      rowSelection={{
        type: 'radio',
        selectedRowKeys: [mainModel.currentProxy],
        onChange: data => mainModel.setCurrentProxy(data[0] as string),
      }}
      footer={() => (
        <Button type="link" onClick={() => mainModel.setShowMode('edit')}>
          {chrome.i18n.getMessage('add')}
        </Button>
      )}
      locale={{
        emptyText: <div style={{ textAlign: 'center' }}>{chrome.i18n.getMessage('no_proxy')}</div>,
      }}
    />
  );
}

export default App;
