import { useState } from 'react'
import { Layout, Menu } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ProxyForm } from '@/pages/options/Components/ProxyForm'
import { getMessage } from '@/utils/i18n'
import classes from './style.module.css'

const { Content, Sider } = Layout

const ADD = 'add'

export function Proxy() {
  const [selectedKey, setSelectedKey] = useState(ADD)
  return (
    <Layout className={classes.layout}>
      <Sider className={classes.sider} width={300}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => setSelectedKey(key)}
        >
          <Menu.Item key={ADD} icon={<PlusOutlined />}>
            {getMessage('add')}
          </Menu.Item>
        </Menu>
      </Sider>
      <Content className={classes.content}>
        <ProxyForm></ProxyForm>
      </Content>
    </Layout>
  )
}
