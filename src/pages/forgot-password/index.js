// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import {styled, useTheme} from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import {useSettings} from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import CardContent from "@mui/material/CardContent";
import FooterIllustrationsV1 from "../../views/pages/auth/FooterIllustrationsV1";
import {Card} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {usePostQuery} from "../../hooks/api";
import {URLS} from "../../constants/url";
import {KEYS} from "../../constants/key";

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)(({theme}) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const ForgotPasswordIllustration = styled('img')(({theme}) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)(({theme}) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({theme}) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({theme}) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {marginTop: theme.spacing(8)}
}))

const LinkStyled = styled(Link)(({theme}) => ({
  display: 'flex',
  '& svg': {mr: 1.5},
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
})
const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const {settings} = useSettings()
  const {mutate, isLoading} = usePostQuery({listKeyId: KEYS.forgotPassword})

  // ** Vars
  const {skin} = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors}
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const onSubmit = (data) => {
    mutate({url: URLS.forgotPassword, attributes: {...data}}, {
      onSuccess: ({data}) => {
        debugger
      },
      onError: () => {
        debugger
      }
    })
  }

  const imageSource =
    skin === 'bordered' ? 'auth-v2-forgot-password-illustration-bordered' : 'auth-v2-forgot-password-illustration'

  return (
    <Box className='content-center'>
      <Card sx={{zIndex: 1}}>
        <CardContent sx={{p: theme => `${theme.spacing(15.5, 7, 8)} !important`}}>
          <Box sx={{mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={47} fill='none' height={26} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint0_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint1_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
              />
              <defs>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint0_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop/>
                  <stop offset='1' stopOpacity='0'/>
                </linearGradient>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint1_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop/>
                  <stop offset='1' stopOpacity='0'/>
                </linearGradient>
              </defs>
            </svg>
            <Typography variant='h6' sx={{ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important'}}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{mb: 6.5}}>
            <Typography variant='h5' sx={{mb: 1.5, letterSpacing: '0.18px', fontWeight: 600}}>
              Forgot Password?
            </Typography>
            <Typography variant='body2'>
              Enter your email and we&prime;ll send you instructions to reset your password
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{mb: 4}}>
              <Controller
                name='email'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange, onBlur}}) => (
                  <TextField
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='admin@materialize.com'
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{color: 'error.main'}}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <Button fullWidth size='large' type='submit' variant='contained' sx={{mb: 5.25}}>
              Send reset link
            </Button>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Typography
                component={Link}
                href='/pages/auth/login-v1'
                sx={{
                  display: 'flex',
                  '& svg': {mr: 1.5},
                  alignItems: 'center',
                  color: 'primary.main',
                  textDecoration: 'none',
                  justifyContent: 'center'
                }}
              >
                <Icon icon='mdi:chevron-left' fontSize='2rem'/>
                <span>Back to login</span>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 image={`/images/pages/auth-v1-forgot-password-mask-${theme.palette.mode}.png`}/>
    </Box>
  )
}
ForgotPassword.guestGuard = true
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ForgotPassword
