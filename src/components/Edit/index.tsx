import React, { useState } from 'react';
import { Row, Col, Form, Radio, Select, Input, InputNumber, Button, Popconfirm } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useModel } from '@tarocch1/use-model';
import { MainModel } from '../../models';
import { ProxyMode } from '../../types';
import { DEFAULT_PROXY_CONFIG } from '../../utils/constants';

function Edit() {
  const mainModel = useModel(MainModel);
  const [proxyMode, setProxyMode] = useState<ProxyMode>(mainModel.edittingProxy.mode);
  const [form] = Form.useForm();
  const onValuesChange = (changedValues: any) => {
    if (changedValues.mode) setProxyMode(changedValues.mode);
  };
  const onDelete = () => {
    mainModel.deleteProxy(mainModel.edittingProxy.id);
    mainModel.resetEdittingProxy();
    mainModel.setShowMode('list');
  };
  const onCancel = () => {
    mainModel.resetEdittingProxy();
    mainModel.setShowMode('list');
  };
  const onFinish = (values: any) => {
    let data: any;
    switch (values.mode) {
      case 'system':
      case 'direct':
        data = {
          ...values,
          ...DEFAULT_PROXY_CONFIG,
        };
        break;
      case 'fixed_servers':
        data = {
          ...values,
        };
        break;
      default:
        break;
    }
    data.id = mainModel.edittingProxy.id || uuidv4();
    if (mainModel.edittingProxy.id) {
      mainModel.editProxy(data);
    } else {
      mainModel.createProxy(data);
    }
    mainModel.setShowMode('list');
  };
  return (
    <Form
      id="edit-form"
      style={{ padding: 16 }}
      form={form}
      layout="vertical"
      initialValues={mainModel.edittingProxy}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      hideRequiredMark
    >
      <Form.Item label={chrome.i18n.getMessage('proxy_name')} name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label={chrome.i18n.getMessage('proxy_mode')} name="mode">
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="fixed_servers">{chrome.i18n.getMessage('manual')}</Radio.Button>
          <Radio.Button value="system">{chrome.i18n.getMessage('system_proxy')}</Radio.Button>
          <Radio.Button value="direct">{chrome.i18n.getMessage('direct')}</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {proxyMode === 'fixed_servers' && (
        <React.Fragment>
          <Form.Item label={chrome.i18n.getMessage('proxy_scheme')} name="scheme" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="http">HTTP</Select.Option>
              <Select.Option value="https">HTTPS</Select.Option>
              <Select.Option value="socks4">Socks4</Select.Option>
              <Select.Option value="socks5">Socks5</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={chrome.i18n.getMessage('proxy_host')} name="host" rules={[{ required: true }]}>
            <Input placeholder="e.g. 127.0.0.1" />
          </Form.Item>
          <Form.Item label={chrome.i18n.getMessage('proxy_port')} name="port" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="e.g. 8080" min={1} max={65535} />
          </Form.Item>
          <Form.Item label={chrome.i18n.getMessage('bypass_list')} name="bypassList">
            <Input.TextArea
              style={{ resize: 'none' }}
              placeholder="e.g. <local>"
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          </Form.Item>
        </React.Fragment>
      )}
      <Form.Item>
        <Row justify="space-between">
          <Col>
            {mainModel.edittingProxy.id !== '' && (
              <Popconfirm
                arrowPointAtCenter
                placement="topLeft"
                title={chrome.i18n.getMessage('delete_confirm')}
                okText={chrome.i18n.getMessage('confirm')}
                cancelText={chrome.i18n.getMessage('cancel')}
                onConfirm={onDelete}
              >
                <Button type="link" danger>
                  {chrome.i18n.getMessage('delete')}
                </Button>
              </Popconfirm>
            )}
          </Col>
          <Col>
            <Button style={{ marginRight: 8 }} onClick={onCancel}>
              {chrome.i18n.getMessage('cancel')}
            </Button>
            <Button type="primary" htmlType="submit">
              {chrome.i18n.getMessage(mainModel.edittingProxy.id !== '' ? 'save' : 'create')}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}

export default Edit;
