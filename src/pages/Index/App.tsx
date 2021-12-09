import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import Nav from './Components/Nav'
import Proxy from './views/Proxy'

const { Header, Content } = Layout

function App() {
  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <img
          style={{
            float: 'left',
            width: 32,
            margin: 16,
            marginLeft: 0,
          }}
          src="/icons/icon128.png"
        ></img>
        <Nav></Nav>
      </Header>
      <Content style={{ marginTop: 64 }}>
        <Routes>
          <Route path="/" element={<Proxy></Proxy>}></Route>
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
