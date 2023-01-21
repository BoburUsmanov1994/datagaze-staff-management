// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm, Controller} from 'react-hook-form'
import FormHelperText from "@mui/material/FormHelperText";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {URLS} from "../../../../constants/url";
import CircularProgress from "@mui/material/CircularProgress";
import {isEqual, get} from "lodash";
import {useRouter} from "next/router";
import {KEYS} from "../../../../constants/key";

const StepAccountDetails = ({handleNext}) => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  const {data: userData, isLoading: isLoadingUserData} = useGetAllQuery({
      key: KEYS.getMe, url: URLS.getMe, params: {
        params: {
          populate: '*'
        },
        headers: {
          Authorization: `Bearer ${get(router.query, 'token')}`
        }
      },
      enabled: !!(get(router.query, 'token'))
    }
  )
  const {mutate: register, isLoading} = usePostQuery({url: URLS.register, hideSuccessToast: true})

  const defaultValues = {
    password: '',
    email: '',
    username: '',
    repeat_password: ''
  }

  const schema =  yup.object().shape({
    password: yup.string().min(5).required(),
    repeat_password: yup.string().min(5).required(),
    username: yup.string().min(3).required(),
    email: yup.string().email().required(),
  })

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = ({password, repeat_password, ...data}) => {
    if(get(userData,'data')){
      handleNext()
    }
    if (!isEqual(password, repeat_password)) {
      setError('repeat_password', {
        type: 'manual',
        message: 'Passwords didnt match'
      })
    } else {
      register({url: URLS.register, attributes: {...data, password,role:3}}, {
        onSuccess: ({data}) => {
          handleNext()
          router.replace({
            pathname: '/register',
            query: {token: get(data, 'jwt'), userId: get(data, 'user.id')}
          })
        },
        onError: (e) => {
          setError('username', {
            type: 'manual',
            message: e.response?.data?.error?.message || 'error'
          })
        }
      })
    }
  }

  useEffect(() => {
    if (get(userData, 'data') && !isLoadingUserData) {
      reset({
        username: get(userData, 'data.username'),
        email: get(userData, 'data.email'),
      })
    }
  }, [userData])


  return (
    <div style={{position: 'relative'}}>
      {(isLoading || isLoadingUserData) && <div style={{
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
      <Box sx={{mb: 4}}>
        <Typography variant='h5'>Account Information</Typography>
        <Typography sx={{color: 'text.secondary'}}>Enter Your Account Details</Typography>
      </Box>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='username'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange, onBlur}}) => (
                  <TextField
                    label='Username'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.username)}
                    placeholder='Username'
                  />
                )}
              />
              {errors.username && <FormHelperText sx={{color: 'error.main'}}>{errors.username.message}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='email'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange, onBlur}}) => (
                  <TextField
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='Email'
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{color: 'error.main'}}>{errors.email.message}</FormHelperText>}
            </FormControl>
          </Grid>
          {!get(userData, 'data') && <><Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange, onBlur}}) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20}/>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{color: 'error.main'}} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-v3-password' error={Boolean(errors.repeat_password)}>
                Repeat password
              </InputLabel>
              <Controller
                name='repeat_password'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange, onBlur}}) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Repeat password'
                    onChange={onChange}
                    id='uth-login-v3-password'
                    error={Boolean(errors.repeat_password)}
                    type={showRepeatPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        >
                          <Icon icon={showRepeatPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20}/>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.repeat_password && (
                <FormHelperText sx={{color: 'error.main'}} id=''>
                  {errors.repeat_password.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid></>}

          <Grid item xs={12}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Button type={'button'} disabled variant='contained'
                      startIcon={<Icon icon='mdi:chevron-left' fontSize={20}/>}>
                Previous
              </Button>
              <Button type='submit' variant='contained' endIcon={<Icon icon='mdi:chevron-right' fontSize={20}/>}>
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default StepAccountDetails
