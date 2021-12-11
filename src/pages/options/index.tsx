import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { i18n } from '@/utils/i18n'
import { storage } from '@/utils/storage'
import { App } from './App'
import 'antd/dist/antd.css'

async function start() {
  await i18n.init()
  await storage.init()

  ReactDOM.render(
    <HashRouter>
      <App />
    </HashRouter>,
    document.querySelector('#root')
  )
}

start()
