import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { i18n } from '@/utils/i18n'
import { storage } from '@/utils/storage'
import { App } from './App'

async function start() {
  await i18n.init()
  await storage.init()

  ReactDOM.render(
    <HashRouter>
      <CssBaseline>
        <App />
      </CssBaseline>
    </HashRouter>,
    document.querySelector('#root')
  )
}

start()
