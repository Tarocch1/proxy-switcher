import React, { useEffect } from 'react'
import { Form, Input, Radio, Button, Select, InputNumber } from 'antd'
import { ProxyFormData, Proxy } from '@/utils/proxy'
import { getMessage } from '@/utils/i18n'
import { Monaco } from '../Monaco'
import classes from './style.module.css'

export function ProxyForm() {
  const [form] = Form.useForm<ProxyFormData>()

  useEffect(() => {
    form.setFieldsValue(Proxy.default())
  }, [])

  const renderForm = function () {
    switch (form.getFieldValue('mode')) {
      case 'fixed_servers':
        return (
          <React.Fragment>
            <Form.Item
              label={getMessage('proxy_scheme')}
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
              label={getMessage('proxy_host')}
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. 127.0.0.1"></Input>
            </Form.Item>
            <Form.Item
              name="post"
              label={getMessage('proxy_port')}
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
                  label={getMessage('proxy_username')}
                  rules={[{ required: true }]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  name="password"
                  label={getMessage('proxy_password')}
                  rules={[{ required: true }]}
                >
                  <Input.Password></Input.Password>
                </Form.Item>
              </React.Fragment>
            )}
            <Form.Item
              name="bypassList"
              label={getMessage('bypass_list')}
              extra={
                <span>
                  {getMessage('bypass_list_extra')}
                  <a
                    href="https://developer.chrome.com/docs/extensions/reference/proxy/#bypass-list"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {getMessage('bypass_list_extra_example')}
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
              label={getMessage('pac_file')}
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
              label={getMessage('pac_script')}
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
              extra={<span>{getMessage('pac_script_extra')}</span>}
            >
              <Monaco language="javascript"></Monaco>
            </Form.Item>
          </React.Fragment>
        )
      default:
        break
    }
  }

  const onFinish = function (values: ProxyFormData) {
    console.log(values)
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
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label={getMessage('proxy_name')}
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {() => (
          <Form.Item
            name="mode"
            label={getMessage('proxy_mode')}
            rules={[{ required: true }]}
            extra={
              form.getFieldValue('mode') === 'direct' ? (
                <span>{getMessage('direct_extra')}</span>
              ) : (
                ''
              )
            }
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="fixed_servers">
                {getMessage('manual')}
              </Radio.Button>
              <Radio.Button value="pac_script">
                {getMessage('auto')}
              </Radio.Button>
              <Radio.Button value="direct">{getMessage('direct')}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item shouldUpdate noStyle>
        {renderForm}
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 12 }}>
        <Button type="primary" htmlType="submit">
          {getMessage('create')}
        </Button>
      </Form.Item>
    </Form>
  )
}
