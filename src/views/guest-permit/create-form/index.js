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


const Header = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  guestName: yup.string().required(),
  visitPurpose: yup.string().required(),
})

const defaultValues = {
  guestName: '',
  visitPurpose: '',
  isOneTime: false
}

const CreateForm = props => {
  // ** Props
  const {open, toggle} = props

  const [checkInDateTime, setCheckInDateTime] = useState(new Date())
  const [checkOutDateTime, setCheckOutDateTime] = useState(new Date())
  const [expireDateTime, setExpireDateTime] = useState(new Date())
  const [oneTime, setOneTime] = useState(false)
  const {data: docTypes, isLoading: isLoadingDocTypes} = useGetAllQuery({
      key: KEYS.docTypes, url: URLS.docTypes, params: {
        params: {
          populate: '*'
        },
      },
    }
  )
  const {data: company, isLoading: isLoadingCompany} = useGetAllQuery({
      key: KEYS.company, url: URLS.company, params: {
        params: {
          populate: '*'
        },
      },
    }
  )
  const {data: employee, isLoading: isLoadingEmployee} = useGetAllQuery({
      key: KEYS.employee, url: URLS.employee, params: {
        params: {
          populate: '*'
        },
      },
    }
  )

  const {mutate: create, isLoading: isLoadingPost} = usePostQuery({
    listKeyId: KEYS.permits,
    hideSuccessToast: true
  })


  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    create({
      url: URLS.permits,
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
      {(isLoadingPost || isLoadingDocTypes || isLoadingCompany || isLoadingEmployee) && <div style={{
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
        <Typography variant='h6'>Add Guest</Typography>
        <IconButton size='small' onClick={handleClose} sx={{color: 'text.primary'}}>
          <Icon icon='mdi:close' fontSize={20}/>
        </IconButton>
      </Header>
      <Box sx={{p: 5}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{mb: 6}}>
            <Controller
              name='guestName'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='Guest Name'
                  onChange={onChange}
                  placeholder='Name'
                  error={Boolean(errors.guestName)}
                />
              )}
            />
            {errors.guestName && <FormHelperText sx={{color: 'error.main'}}>{errors.guestName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 6}}>
            <Controller
              name='visitPurpose'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='Visit purpose'
                  onChange={onChange}
                  placeholder='Purpose'
                  error={Boolean(errors.visitPurpose)}
                />
              )}
            />
            {errors.visitPurpose &&
            <FormHelperText sx={{color: 'error.main'}}>{errors.visitPurpose.message}</FormHelperText>}
          </FormControl>
          <DatePickerWrapper sx={{mb: 6}}>
            <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={checkInDateTime}
              id='date-time-picker'
              dateFormat='MM/dd/yyyy h:mm aa'
              popperPlacement={'bottom-end'}
              onChange={date => setCheckInDateTime(date)}
              customInput={<PickersCustomInput label='Check in time'/>
              }
            />
          </DatePickerWrapper>
          <DatePickerWrapper sx={{mb: 6}}>
            <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={checkOutDateTime}
              id='date-time-picker'
              dateFormat='MM/dd/yyyy h:mm aa'
              popperPlacement={'bottom-end'}
              onChange={date => setCheckOutDateTime(date)}
              customInput={<PickersCustomInput label='Check out time'/>
              }
            />
          </DatePickerWrapper>

          <DatePickerWrapper sx={{mb: 6}}>
            <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={expireDateTime}
              id='date-time-picker'
              dateFormat='MM/dd/yyyy h:mm aa'
              popperPlacement={'bottom-end'}
              onChange={date => setExpireDateTime(date)}
              customInput={<PickersCustomInput label='Expire date'/>
              }
            />
          </DatePickerWrapper>
          <FormControl fullWidth sx={{mb: 6}}>
            <Controller
              name='phone'
              control={control}
              render={({field: {value, onChange, onBlur}}) => (
                <TextField
                  label='Phone'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder='-- --- -- --'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>UZ (+998)</InputAdornment>
                  }}
                />
              )}
            />

          </FormControl>
          <FormControlLabel sx={{mb: 6}}
                            control={<Switch onChange={(e) => setOneTime(e.target.checked)} checked={oneTime}/>}
                            label='In one time'/>
          <FormControl fullWidth sx={{mb: 6}}>
            <InputLabel
              id='validation-basic-select2'
              error={Boolean(errors.docType)}
              htmlFor='validation-basic-select2'
            >
              Doc type
            </InputLabel>
            <Controller
              name='docType'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  value={value}
                  label='Country'
                  onChange={onChange}
                  error={Boolean(errors.docType)}
                  labelId='validation-basic-select2'
                  aria-describedby='validation-basic-select2'
                >
                  {
                    get(docTypes, 'data.results', []).map(item => <MenuItem key={get(item, 'id')} value={
                      get(item, "id")
                    }>{get(item, "name")}</MenuItem>)
                  }
                </Select>
              )}
            />
            {errors.docType && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-basic-select2'>
                field is required
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 6}}>
            <InputLabel
              id='validation-basic-select3'
              error={Boolean(errors.company)}
              htmlFor='validation-basic-select3'
            >
              Company
            </InputLabel>
            <Controller
              name='company'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  value={value}
                  label='Company'
                  onChange={onChange}
                  error={Boolean(errors.company)}
                  labelId='validation-basic-select3'
                  aria-describedby='validation-basic-select3'
                >
                  {
                    get(company, 'data.results', []).map(item => <MenuItem key={get(item, 'id')} value={
                      get(item, "id")
                    }>{get(item, "name")}</MenuItem>)
                  }
                </Select>
              )}
            />
            {errors.company && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-basic-select3'>
                field is required
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 6}}>
            <InputLabel
              id='validation-basic-select4'
              error={Boolean(errors.employee)}
              htmlFor='validation-basic-select4'
            >
              Employee
            </InputLabel>
            <Controller
              name='employee'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  value={value}
                  label='Employee'
                  onChange={onChange}
                  error={Boolean(errors.employee)}
                  labelId='validation-basic-select4'
                  aria-describedby='validation-basic-select4'
                >
                  {
                    get(employee, 'data.results', []).map(item => <MenuItem key={get(item, 'id')} value={
                      get(item, "id")
                    }>{get(item, "name")}</MenuItem>)
                  }
                </Select>
              )}
            />
            {errors.employee && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-basic-select4'>
                field is required
              </FormHelperText>
            )}
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
