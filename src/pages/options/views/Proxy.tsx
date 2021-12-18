import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Grid,
  List,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined'
import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import { ProxyForm } from '@/pages/options/Components/ProxyForm'
import { i18n } from '@/utils/i18n'
import { storage } from '@/utils/storage'
import { eventEmitter, STORAGE_CHANGED } from '@/utils/event'

const ADD = 'add'

export function Proxy() {
  const [selectedKey, setSelectedKey] = useState(ADD)
  const selectedKeyRef = useRef(selectedKey)
  const [, setState] = useState({})

  const storageChangeHandler = useCallback(function () {
    if (
      !storage.proxy.some((proxy) => proxy.id === selectedKeyRef.current) &&
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
    <Grid container>
      <Grid item>
        <List sx={{ width: 300 }}>
          {storage.proxy.map((proxy) => (
            <ListItemButton
              key={proxy.id}
              selected={selectedKey === proxy.id}
              onClick={() => setSelectedKey(proxy.id)}
            >
              <ListItemIcon>
                {
                  {
                    fixed_servers: <PolylineOutlinedIcon />,
                    pac_script: <SignpostOutlinedIcon />,
                    direct: <RouteOutlinedIcon />,
                  }[proxy.mode]
                }
              </ListItemIcon>
              <ListItemText primary={proxy.name} />
            </ListItemButton>
          ))}
          {Object.values(storage.proxy).length > 0 && <Divider />}
          <ListItemButton
            selected={selectedKey === ADD}
            onClick={() => setSelectedKey(ADD)}
          >
            <ListItemIcon>
              <AddOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={i18n.getMessage('add')} />
          </ListItemButton>
        </List>
      </Grid>
      <Grid item sx={{ flexGrow: 1, paddingX: 2, paddingY: 4 }}>
        <ProxyForm id={selectedKey === ADD ? undefined : selectedKey} />
      </Grid>
    </Grid>
  )
}
