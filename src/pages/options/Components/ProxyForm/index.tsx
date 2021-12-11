import React, { useEffect } from 'react'
import {
  Form,
  Input,
  Radio,
  Button,
  Select,
  InputNumber,
  Popconfirm,
  message,
} from 'antd'
import { ProxyFormData, Proxy } from '@/utils/proxy'
import { i18n } from '@/utils/i18n'
import { storage } from '@/utils/storage'
import { Monaco } from '../Monaco'
import classes from './style.module.css'

export type ProxyFormProps = {
  id?: string
}

export function ProxyForm({ id }: ProxyFormProps) {
  const [form] = Form.useForm<ProxyFormData>()

  useEffect(
    function () {
      form.resetFields()
      form.setFieldsValue(id ? storage.proxy[id] : Proxy.default())
    },
    [id]
  )

  const onFinish = function (values: Partial<ProxyFormData>) {
    storage.addOrEditProxy({
      ...Proxy.default(),
      ...(id ? { id } : {}),
      ...values,
    })
    message.success(i18n.getMessage('success'))
    if (!id) {
      form.resetFields()
    }
  }

  const onDelete = function () {
    storage.deleteProxy(id!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    message.success(i18n.getMessage('success'))
  }

  const renderForm = function () {
    switch (form.getFieldValue('mode')) {
      case 'fixed_servers':
        return (
          <React.Fragment>
            <Form.Item
              label={i18n.getMessage('proxy_scheme')}
              name="scheme"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="http">HTTP</Select.Option>
                <Select.Option value="https">HTTPS</Select.Option>
                <Select.Option value="socks4">Socks4</Select.Option>
                <Select.Option value="socks5">Socks5</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="host"
              label={i18n.getMessage('proxy_host')}
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. 127.0.0.1"></Input>
            </Form.Item>
            <Form.Item
              name="post"
              label={i18n.getMessage('proxy_port')}
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{
                  width: '100%',
                }}
                min={1}
                max={65535}
                placeholder="e.g. 8080"
              ></InputNumber>
            </Form.Item>
            {['http', 'https'].includes(form.getFieldValue('scheme')) && (
              <React.Fragment>
                <Form.Item
                  name="username"
                  label={i18n.getMessage('proxy_username')}
                  rules={[{ required: true }]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  name="password"
                  label={i18n.getMessage('proxy_password')}
                  rules={[{ required: true }]}
                >
                  <Input.Password></Input.Password>
                </Form.Item>
              </React.Fragment>
            )}
            <Form.Item
              name="bypassList"
              label={i18n.getMessage('bypass_list')}
              extra={
                <span>
                  {i18n.getMessage('bypass_list_extra')}
                  <a
                    href="https://developer.chrome.com/docs/extensions/reference/proxy/#bypass-list"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {i18n.getMessage('bypass_list_extra_example')}
                  </a>
                </span>
              }
            >
              <Monaco language="plain"></Monaco>
            </Form.Item>
          </React.Fragment>
        )
      case 'pac_script':
        return (
          <React.Fragment>
            <Form.Item
              name="pacUrl"
              label={i18n.getMessage('pac_file')}
              normalize={(value) => {
                setTimeout(() => form.validateFields(['pacScript']), 0)
                return value
              }}
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (getFieldValue('pacScript') || value)
                      return Promise.resolve()
                    return Promise.reject('')
                  },
                }),
              ]}
            >
              <Input placeholder="e.g. http://127.0.0.1:1080/pac"></Input>
            </Form.Item>
            <Form.Item
              name="pacScript"
              label={i18n.getMessage('pac_script')}
              normalize={(value) => {
                setTimeout(() => form.validateFields(['pacUrl']), 0)
                return value
              }}
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (getFieldValue('pacUrl') || value)
                      return Promise.resolve()
                    return Promise.reject('')
                  },
                }),
              ]}
              extra={<span>{i18n.getMessage('pac_script_extra')}</span>}
            >
              <Monaco language="javascript"></Monaco>
            </Form.Item>
          </React.Fragment>
        )
      default:
        break
    }
  }

  return (
    <Form
      className={classes.form}
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      validateMessages={{
        required: '',
      }}
      initialValues={Proxy.default()}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label={i18n.getMessage('proxy_name')}
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => (
          <Form.Item
            name="mode"
            label={i18n.getMessage('proxy_mode')}
            rules={[{ required: true }]}
            extra={
              form.getFieldValue('mode') === 'direct' ? (
                <span>{i18n.getMessage('direct_extra')}</span>
              ) : (
                ''
              )
            }
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="fixed_servers">
                {i18n.getMessage('manual')}
              </Radio.Button>
              <Radio.Button value="pac_script">
                {i18n.getMessage('auto')}
              </Radio.Button>
              <Radio.Button value="direct">
                {i18n.getMessage('direct')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {renderForm}
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 12 }}>
        <Button type="primary" htmlType="submit">
          {i18n.getMessage(id ? 'save' : 'create')}
        </Button>
        {id && (
          <Popconfirm
            arrowPointAtCenter
            placement="topLeft"
            title={i18n.getMessage('delete_confirm')}
            okText={i18n.getMessage('confirm')}
            cancelText={i18n.getMessage('cancel')}
            onConfirm={onDelete}
          >
            <Button style={{ marginLeft: 8 }} danger>
              {i18n.getMessage('delete')}
            </Button>
          </Popconfirm>
        )}
      </Form.Item>
    </Form>
  )
}
