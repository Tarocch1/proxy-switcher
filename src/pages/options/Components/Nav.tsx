import { AppBar, Toolbar, Grid, Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { i18n } from '@/utils/i18n'

export function Nav() {
  const location = useLocation()
  const navigate = useNavigate()

  const routes = [
    {
      name: i18n.getMessage('proxy'),
      path: '/',
    },
  ]

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar disableGutters>
        <img
          style={{
            width: 32,
            margin: '0 24px',
          }}
          src="/icons/icon128.png"
        ></img>
        <Grid container columnSpacing={0.5}>
          {routes.map((route) => (
            <Grid item key={route.name}>
              <Button
                variant={
                  route.path === location.pathname ? 'contained' : 'text'
                }
                color="secondary"
                onClick={() => navigate(route.path)}
                sx={{ color: 'white' }}
              >
                {route.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
