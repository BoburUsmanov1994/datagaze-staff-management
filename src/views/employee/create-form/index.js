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
import {usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import CircularProgress from "@mui/material/CircularProgress";


const Header = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
})

const defaultValues = {
  firstName: '',
  lastName: '',
}

const CreateForm = props => {

  const {open, toggle} = props

  const {mutate: create, isLoading: isLoadingPost} = usePostQuery({
    listKeyId: KEYS.employee,
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
      url: URLS.employee,
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
              name='firstName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='First name'
                  onChange={onChange}
                  placeholder='First name'
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.firstName && <FormHelperText sx={{color: 'error.main'}}>{errors.firstName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 6}}>
            <Controller
              name='lastName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='Last name'
                  onChange={onChange}
                  placeholder='Last name'
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{color: 'error.main'}}>{errors.lastName.message}</FormHelperText>}
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
