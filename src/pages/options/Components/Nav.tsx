import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMessage } from '@/utils/i18n'

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
      <Menu.Item key="/">{getMessage('proxy')}</Menu.Item>
    </Menu>
  )
}
