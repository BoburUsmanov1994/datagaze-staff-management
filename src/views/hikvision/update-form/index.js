// ** React Imports
import {useEffect, useState, useMemo} from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm, Controller} from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import 'cleave.js/dist/addons/cleave-phone.us'
import {useGetOneQuery, usePostQuery, usePutQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import CircularProgress from "@mui/material/CircularProgress";
import FallbackSpinner from "../../../@core/components/spinner";
import {get} from "lodash"


const Header = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  ip: yup.string().required(),
  name: yup.string().required(),
  password: yup.string().required(),
})


const UpdateForm = props => {
  const {open, toggle, id} = props


  const {mutate: update, isLoading: isLoadingPut} = usePutQuery({
    listKeyId: KEYS.hikvision,
    hideSuccessToast: true
  })
  const {data, isLoading} = useGetOneQuery({
    id,
    url: URLS.hikvision,
    params: {},
    enabled: !!(id)
  })


  const {
    reset,
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        ip: get(data, 'data.ip'),
        name: get(data, 'data.name'),
        password: get(data, 'data.password')
      }
    }, [data])
    ,
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    reset({
      ip: get(data, 'data.ip'),
      name: get(data, 'data.name'),
      password: get(data, 'data.password')
    });
  }, [data]);

  const onSubmit = data => {
    update({
      url: `${URLS.hikvision}/${id}`,
      attributes: {
        data: {
          ...data
        }
      },
    }, {
      onSuccess: ({data}) => {
        toggle()
        reset()
      },
      onError: (e) => {
        toggle()
        reset()
      }
    })
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  if (isLoading) {
    return <FallbackSpinner/>;
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      {(isLoadingPut) && <div style={{
        position: 'absolute',
        zIndex: '9999',
        top: '50%',
        height: '100vh',
        width: '100%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.35)'
      }}>
        <Box sx={{mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <CircularProgress sx={{mb: 4}}/>
          <Typography>Loading...</Typography>
        </Box>
      </div>}
      <Header>
        <Typography variant='h6'>Update</Typography>
        <IconButton size='small' onClick={handleClose} sx={{color: 'text.primary'}}>
          <Icon icon='mdi:close' fontSize={20}/>
        </IconButton>
      </Header>
      <Box sx={{p: 5}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{mb: 6}}>
            <Controller
              name='ip'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='IP'
                  onChange={onChange}
                  placeholder='IP'
                  error={Boolean(errors.ip)}
                />
              )}
            />
            {errors.ip && <FormHelperText sx={{color: 'error.main'}}>{errors.ip.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 6}}>
            <Controller
              name='name'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='Name'
                  onChange={onChange}
                  placeholder='Name'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 6}}>
            <Controller
              name='password'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='Password'
                  onChange={onChange}
                  type={'password'}
                  placeholder='Password'
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && <FormHelperText sx={{color: 'error.main'}}>{errors.password.message}</FormHelperText>}
          </FormControl>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button size='large' type='submit' variant='contained' sx={{mr: 3}}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default UpdateForm
