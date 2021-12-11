import { useState, useEffect, useRef, useCallback } from 'react'
import { Layout, Menu } from 'antd'
import {
  PlusOutlined,
  ApiOutlined,
  CodeOutlined,
  ClusterOutlined,
} from '@ant-design/icons'
import { ProxyForm } from '@/pages/options/Components/ProxyForm'
import { i18n } from '@/utils/i18n'
import { storage } from '@/utils/storage'
import { eventEmitter, STORAGE_CHANGED } from '@/utils/event'
import classes from './style.module.css'

const { Content, Sider } = Layout

const ADD = 'add'

export function Proxy() {
  const [selectedKey, setSelectedKey] = useState(ADD)
  const selectedKeyRef = useRef(selectedKey)
  const [, setState] = useState({})

  const storageChangeHandler = useCallback(function () {
    if (
      !storage.proxy[selectedKeyRef.current] &&
      selectedKeyRef.current !== ADD
    ) {
      setSelectedKey(ADD)
      return
    }
    setState({})
  }, [])

  useEffect(
    function () {
      selectedKeyRef.current = selectedKey
    },
    [selectedKey]
  )

  useEffect(function () {
    eventEmitter.on(STORAGE_CHANGED, storageChangeHandler)
    return () => {
      eventEmitter.removeListener(STORAGE_CHANGED, storageChangeHandler)
    }
  }, [])

  return (
    <Layout className={classes.layout}>
      <Sider className={classes.sider} width={300}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => setSelectedKey(key)}
        >
          {Object.values(storage.proxy).map((proxy) => (
            <Menu.Item
              key={proxy.id}
              icon={
                {
                  direct: <ApiOutlined />,
                  pac_script: <CodeOutlined />,
                  fixed_servers: <ClusterOutlined />,
                }[proxy.mode]
              }
            >
              {proxy.name}
            </Menu.Item>
          ))}
          <Menu.Item key={ADD} icon={<PlusOutlined />}>
            {i18n.getMessage('add')}
          </Menu.Item>
        </Menu>
      </Sider>
      <Content className={classes.content}>
        <ProxyForm
          id={selectedKey === ADD ? undefined : selectedKey}
        ></ProxyForm>
      </Content>
    </Layout>
  )
}
