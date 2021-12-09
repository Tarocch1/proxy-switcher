import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { MenuProps } from 'antd/es/menu'

function Nav() {
  const location = useLocation()
  const navigate = useNavigate()

  const onSelect: MenuProps['onSelect'] = function ({ key }) {
    navigate(key)
  }

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onSelect={onSelect}
    >
      <Menu.Item key="/">Proxy</Menu.Item>
    </Menu>
  )
}

export default Nav
