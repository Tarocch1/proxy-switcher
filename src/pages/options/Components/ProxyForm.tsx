import React, { useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  Link,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useFormik, FormikErrors } from 'formik'
import { ProxyFormData, Proxy } from '@/utils/proxy'
import { i18n } from '@/utils/i18n'
import { storage } from '@/utils/storage'

export type ProxyFormProps = {
  id?: string
}

export function ProxyForm({ id }: ProxyFormProps) {
  const [open, setOpen] = useState(false)
  const formik = useFormik<ProxyFormData>({
    initialValues: Proxy.default(),
    validate: async (values) => {
      const errors: FormikErrors<ProxyFormData> = {}
      if (!values.name) errors.name = 'required'
      if (values.mode === 'fixed_servers') {
        if (!values.host) errors.host = 'required'
        if (!values.port) errors.port = 'required'
      }
      if (values.mode === 'pac_script') {
        if (!values.pacUrl && !values.pacScript) {
          errors.pacUrl = 'required'
          errors.pacScript = 'required'
        }
      }
      return errors
    },
    onSubmit: (values) => {
      console.log(values)
      storage.addOrEditProxy(values)
      if (!id) {
        formik.resetForm({
          values: Proxy.default(),
        })
      }
    },
  })

  useEffect(
    function () {
      formik.resetForm({
        values: id
          ? storage.proxy.find((proxy) => proxy.id === id)
          : Proxy.default(),
      })
    },
    [id]
  )

  const onDelete = function () {
    setOpen(false)
    storage.deleteProxy(id!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  }

  return (
    <Grid container sx={{ justifyContent: 'center' }}>
      <Grid item sx={{ flexGrow: 1, maxWidth: 600 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={2}
            sx={{ flexWrap: 'wrap', paddingLeft: -1.5 }}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label={i18n.getMessage('proxy_name')}
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="mode-label">
                  {i18n.getMessage('proxy_mode')}
                </InputLabel>
                <Select
                  labelId="mode-label"
                  id="mode"
                  name="mode"
                  value={formik.values.mode}
                  onChange={formik.handleChange}
                  label={i18n.getMessage('proxy_mode')}
                >
                  <MenuItem value="fixed_servers">
                    {i18n.getMessage('manual')}
                  </MenuItem>
                  <MenuItem value="pac_script">
                    {i18n.getMessage('auto')}
                  </MenuItem>
                  <MenuItem value="direct">
                    {i18n.getMessage('direct')}
                  </MenuItem>
                </Select>
                {formik.values.mode === 'direct' && (
                  <FormHelperText>
                    <span>{i18n.getMessage('direct_extra')}</span>
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {formik.values.mode === 'fixed_servers' && (
              <React.Fragment>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="scheme-label">
                      {i18n.getMessage('proxy_scheme')}
                    </InputLabel>
                    <Select
                      labelId="scheme-label"
                      id="scheme"
                      name="scheme"
                      value={formik.values.scheme}
                      onChange={formik.handleChange}
                      label={i18n.getMessage('proxy_scheme')}
                    >
                      <MenuItem value="http">HTTP</MenuItem>
                      <MenuItem value="https">HTTPS</MenuItem>
                      <MenuItem value="socks4">Socks4</MenuItem>
                      <MenuItem value="socks5">Socks5</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="host"
                    name="host"
                    label={i18n.getMessage('proxy_host')}
                    variant="outlined"
                    placeholder="e.g. 127.0.0.1"
                    value={formik.values.host}
                    onChange={formik.handleChange}
                    error={formik.touched.host && Boolean(formik.errors.host)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="port"
                    name="port"
                    type="number"
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      min: 1,
                      max: 65536,
                    }}
                    label={i18n.getMessage('proxy_port')}
                    variant="outlined"
                    placeholder="e.g. 8080"
                    value={formik.values.port}
                    onChange={formik.handleChange}
                    error={formik.touched.port && Boolean(formik.errors.port)}
                  />
                </Grid>
                {['http', 'https'].includes(formik.values.scheme) && (
                  <React.Fragment>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label={i18n.getMessage('proxy_username')}
                        variant="outlined"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.username &&
                          Boolean(formik.errors.username)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label={i18n.getMessage('proxy_password')}
                        variant="outlined"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                      />
                    </Grid>
                  </React.Fragment>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="bypassList"
                    name="bypassList"
                    label={i18n.getMessage('bypass_list')}
                    variant="outlined"
                    placeholder="e.g. <local>"
                    multiline
                    minRows={6}
                    value={formik.values.bypassList}
                    onChange={formik.handleChange}
                    helperText={
                      <span>
                        {i18n.getMessage('bypass_list_extra')}
                        <Link
                          href="https://developer.chrome.com/docs/extensions/reference/proxy/#bypass-list"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {i18n.getMessage('bypass_list_extra_example')}
                        </Link>
                      </span>
                    }
                  />
                </Grid>
              </React.Fragment>
            )}

            {formik.values.mode === 'pac_script' && (
              <React.Fragment>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="pacUrl"
                    name="pacUrl"
                    label={i18n.getMessage('pac_file')}
                    variant="outlined"
                    placeholder="e.g. http://127.0.0.1:1080/pac"
                    value={formik.values.pacUrl}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.pacUrl && Boolean(formik.errors.pacUrl)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="pacScript"
                    name="pacScript"
                    label={i18n.getMessage('pac_script')}
                    variant="outlined"
                    multiline
                    minRows={6}
                    value={formik.values.pacScript}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.pacScript &&
                      Boolean(formik.errors.pacScript)
                    }
                    helperText={
                      <span>{i18n.getMessage('pac_script_extra')}</span>
                    }
                  />
                </Grid>
              </React.Fragment>
            )}

            <Grid item>
              <Button color="primary" variant="contained" type="submit">
                {i18n.getMessage(id ? 'save' : 'create')}
              </Button>
            </Grid>
            {id && (
              <Grid item>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => setOpen(true)}
                >
                  {i18n.getMessage('delete')}
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
        <Dialog open={open}>
          <DialogContent>{i18n.getMessage('delete_confirm')}</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>
              {i18n.getMessage('cancel')}
            </Button>
            <Button color="error" variant="contained" onClick={onDelete}>
              {i18n.getMessage('confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  )
}
