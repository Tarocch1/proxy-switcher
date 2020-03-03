import React, { useEffect } from 'react';
import { Table, Button } from 'antd';
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
    _mainModel.setEdittingProxy(data);
    _mainModel.setShowMode('edit');
  };
  useEffect(() => {
    _mainModel.getProxyList();
    _mainModel.getCurrentProxy();
  }, []);
  return (
    <Table
      size="middle"
      columns={columns}
      dataSource={_mainModel.proxyList}
      rowKey="id"
      showHeader={false}
      pagination={false}
      rowSelection={{
        type: 'radio',
        selectedRowKeys: [_mainModel.currentProxy],
        onChange: data => _mainModel.setCurrentProxy(data[0] as string),
      }}
      footer={() => (
        <Button type="link" onClick={() => _mainModel.setShowMode('edit')}>
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
