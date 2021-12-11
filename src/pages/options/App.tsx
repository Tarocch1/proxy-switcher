import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import { Nav } from './Components/Nav'
import { Proxy } from './views/Proxy'
import classes from './app.module.css'

const { Header, Content } = Layout

export function App() {
  return (
    <Layout>
      <Header className={classes.header}>
        <img className={classes.logo} src="/icons/icon128.png"></img>
        <Nav></Nav>
      </Header>
      <Content className={classes.content}>
        <Routes>
          <Route path="/" element={<Proxy></Proxy>}></Route>
        </Routes>
      </Content>
    </Layout>
  )
}
