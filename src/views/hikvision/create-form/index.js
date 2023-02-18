// ** React Imports
import {useState} from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
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

// ** Store Imports
import {useDispatch} from 'react-redux'

// ** Actions Imports
import {addUser} from 'src/store/apps/user'
import DatePicker from "react-datepicker";
import PickersCustomInput from "../../forms/form-elements/pickers/PickersCustomInput";
import DatePickerWrapper from "../../../@core/styles/libs/react-datepicker";
import CleaveWrapper from "../../../@core/styles/libs/react-cleave";
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import {FormControlLabel, Switch} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import {get} from "lodash";
import Grid from "@mui/material/Grid";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import CircularProgress from "@mui/material/CircularProgress";
import OutlinedInput from "@mui/material/OutlinedInput";


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

const defaultValues = {
  ip: '',
  name: '',
  password: ''
}

const CreateForm = props => {

  const {open, toggle} = props

  const {mutate: create, isLoading: isLoadingPost} = usePostQuery({
    listKeyId: KEYS.hikvision,
    hideSuccessToast: true
  })


  const {
    reset,
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    create({
      url: URLS.hikvision,
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

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      {(isLoadingPost) && <div style={{
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
        <Typography variant='h6'>Add</Typography>
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

export default CreateForm
