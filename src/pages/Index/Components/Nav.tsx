import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

export function Nav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onSelect={({ key }) => navigate(key)}
    >
      <Menu.Item key="/">Proxy</Menu.Item>
    </Menu>
  )
}
