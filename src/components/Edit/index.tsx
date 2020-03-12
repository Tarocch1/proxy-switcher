import React, { useState } from 'react';
import { Row, Col, Form, Radio, Select, Input, InputNumber, Button, Popconfirm } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useModel } from '@tarocch1/use-model';
import { MainModel } from '../../models';
import { ProxyMode, IProxyFormData } from '../../types';
import { DEFAULT_PROXY_FORMDATA } from '../../utils/constants';

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
    const data: IProxyFormData = {
      ...DEFAULT_PROXY_FORMDATA,
      ...values,
    };
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
          <Radio.Button value="pac_script">{chrome.i18n.getMessage('auto')}</Radio.Button>
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
          <Form.Item>
            <Input.Group compact>
              <Form.Item
                style={{ marginTop: 0, marginBottom: 0, width: '66.7%' }}
                name="host"
                label={chrome.i18n.getMessage('proxy_host')}
                rules={[{ required: true }]}
              >
                <Input style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} placeholder="e.g. 127.0.0.1" />
              </Form.Item>
              <Form.Item
                style={{ marginTop: 0, marginBottom: 0, width: '33.3%' }}
                name="port"
                label={chrome.i18n.getMessage('proxy_port')}
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  placeholder="e.g. 8080"
                  min={1}
                  max={65535}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label={chrome.i18n.getMessage('bypass_list')}
            extra={
              <span>
                {chrome.i18n.getMessage('bypass_list_extra')}
                <a
                  onClick={() => {
                    chrome.tabs.create({ url: 'https://developer.chrome.com/extensions/proxy#bypass_list' });
                  }}
                >
                  {chrome.i18n.getMessage('bypass_list_extra_example')}
                </a>
              </span>
            }
            name="bypassList"
          >
            <Input.TextArea
              style={{ resize: 'none' }}
              placeholder="e.g. <local>"
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          </Form.Item>
        </React.Fragment>
      )}
      {proxyMode === 'pac_script' && (
        <Form.Item label={chrome.i18n.getMessage('pac_file')} name="pacUrl" rules={[{ required: true }]}>
          <Input placeholder="e.g. http://127.0.0.1:1080/pac" />
        </Form.Item>
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
                <Button danger>{chrome.i18n.getMessage('delete')}</Button>
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
