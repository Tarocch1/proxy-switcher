import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { initI18n } from '@/utils/i18n'
import { App } from './App'
import 'antd/dist/antd.css'

async function start() {
  await initI18n()

  ReactDOM.render(
    <HashRouter>
      <App />
    </HashRouter>,
    document.querySelector('#root')
  )
}

start()
