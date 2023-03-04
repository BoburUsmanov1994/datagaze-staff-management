import {useState} from "react";
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
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import CircularProgress from "@mui/material/CircularProgress";
import {useDropzone} from 'react-dropzone'
import Link from "next/link";
import toast from "react-hot-toast";
import {get,forEach} from "lodash"
import DatePickerWrapper from "../../../@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import PickersCustomInput from "../../forms/form-elements/pickers/PickersCustomInput";


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
  const [files, setFiles] = useState([])
  const [filePath, setFilePath] = useState(null);
  const [startDate, setStartDate] = useState(new Date())
  const [expireDateTime, setExpireDateTime] = useState(new Date())
  const {open, toggle} = props

  const {data: devices, isLoading: isLoadingDevice} = useGetAllQuery({
      key: KEYS.hikvision, url: URLS.hikvision, params: {
        params: {
          populate: '*'
        },
      },
    }
  )

  const {mutate: create, isLoading: isLoadingPost} = usePostQuery({
    listKeyId: KEYS.employee,
    hideSuccessToast: true
  })

  const {mutate: uploadRequest, isLoading: isLoadingUpload} = usePostQuery({
    listKeyId: KEYS.uploadEmployeeImg,
    hideSuccessToast: true
  })

  const {mutate: createDevice, isLoading: isLoadingPostDevice} = usePostQuery({
    listKeyId: KEYS.employee,
    hideSuccessToast: true
  })


  // ** Hook
  const {getRootProps, getInputProps} = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      const formData = new FormData();
      formData.append('face', acceptedFiles[0]);
      uploadRequest({
          url: URLS.uploadEmployeeImg,
          attributes: formData
        },
        {
          onSuccess: ({data: response}) => {
            setFilePath(get(response, 'url'))
            toast.success('File uploaded')
          }
        }
      )
    }
  })

  const handleLinkClick = event => {
    event.preventDefault()
  }

  const img = files.map(file => (
    <img style={{height: 75, objectFit: 'cover', display: 'inline-block'}} key={file.name} alt={file.name}
         className='single-file-image' src={URL.createObjectURL(file)}/>
  ))


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
          ...data,
          face: filePath
        }
      },
    }, {
      onSuccess: ({data: {data: {id}}}) => {
        forEach(get(devices, 'data.results', []), (item) => {
          createDevice({
              url: URLS.assignHikvision,
              attributes: {
                employeeId: id,
                hikvisionId: get(item, 'id'),
                beginTime: startDate,
                endTime: expireDateTime,
              }
            },
            {
              onError: () => {
                toast.error('Error')
              }
            })
        })
        handleClose()
      },
      onError: (e) => {
        handleClose()
      }
    })
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  console.log('devices', devices)

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      {(isLoadingPost || isLoadingUpload || isLoadingPostDevice || isLoadingDevice) && <div style={{
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
        <Box {...getRootProps({className: 'dropzone'})} sx={files.length ? {height: 100} : {}}>
          <input {...getInputProps()} />
          {files.length ? (
            img
          ) : (
            <Box style={{marginBottom: '15px'}} sx={{
              display: 'flex',
              flexDirection: ['column', 'column', 'row'],
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit']}}>
                <Typography color='textSecondary'>
                  Drop files here or click{' '}
                  <Link href='/' onClick={handleLinkClick}>
                    browse
                  </Link>{' '}
                  thorough your machine
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
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
          <DatePickerWrapper sx={{mb: 6}}>
            <DatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={startDate}
              id='date-time-picker'
              dateFormat='MM/dd/yyyy h:mm aa'
              popperPlacement={'bottom-end'}
              onChange={date => setStartDate(date)}
              customInput={<PickersCustomInput label='Check in time'/>
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
