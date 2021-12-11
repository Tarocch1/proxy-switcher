import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import 'antd/dist/antd.css'

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.querySelector('#root')
)
