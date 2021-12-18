import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { Nav } from './Components/Nav'
import { Proxy } from './views/Proxy'
import React from 'react'

export function App() {
  return (
    <React.Fragment>
      <Nav />
      <Box>
        <Routes>
          <Route path="/" element={<Proxy />} />
        </Routes>
      </Box>
    </React.Fragment>
  )
}
