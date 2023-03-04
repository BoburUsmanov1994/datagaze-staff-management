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
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {get} from "lodash";
import MenuItem from "@mui/material/MenuItem";


const Header = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  country: yup.string().required(),
  company_category: yup.string().required(),
  name: yup.string().required(),
  address: yup.string().required(),

})

const defaultValues = {
  country: '',
  company_category: '',
  name: '',
  address: '',
}

const CreateForm = props => {

  const {open, toggle} = props

  const {data: countyList, isLoading: isLoadingCountry} = useGetAllQuery({
      key: KEYS.country, url: URLS.country, params: {
        params: {
          populate: '*'
        },
      },
    }
  )
  const {data: companyCategoryList, isLoading: isLoadingCompanyCategory} = useGetAllQuery({
      key: KEYS.companyCategory, url: URLS.companyCategory, params: {
        params: {
          populate: '*'
        },
      },
    }
  )

  const {mutate: create, isLoading: isLoadingPost} = usePostQuery({
    listKeyId: KEYS.company
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
      url: URLS.company,
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
      {(isLoadingPost || isLoadingCountry || isLoadingCompanyCategory) && <div style={{
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
            <InputLabel
              id='validation-basic-select2'
              error={Boolean(errors.country)}
              htmlFor='validation-basic-select2'
            >
              Country
            </InputLabel>
            <Controller
              name='country'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  value={value}
                  label='Country'
                  onChange={onChange}
                  error={Boolean(errors.country)}
                  labelId='validation-basic-select2'
                  aria-describedby='validation-basic-select2'
                >
                  {
                    get(countyList, 'data.data', []).map(item => <MenuItem key={get(item, 'id')} value={
                      get(item, "id")
                    }>{get(item, "attributes.name")}</MenuItem>)
                  }
                </Select>
              )}
            />
            {errors.country && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-basic-select2'>
                field is required
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 6}}>
            <InputLabel
              id='validation-basic-select3'
              error={Boolean(errors.company_category)}
              htmlFor='validation-basic-select3'
            >
              Company category
            </InputLabel>
            <Controller
              name='company_category'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  value={value}
                  label='Company category'
                  onChange={onChange}
                  error={Boolean(errors.company_category)}
                  labelId='validation-basic-select3'
                  aria-describedby='validation-basic-select3'
                >
                  {
                    get(companyCategoryList, 'data.results', []).map(item => <MenuItem key={get(item, 'id')}
                                                                                       value={
                                                                                         get(item, "id")
                                                                                       }>{get(item, "name")}</MenuItem>)
                  }
                </Select>
              )}
            />
            {errors.company_category && (
              <FormHelperText sx={{color: 'error.main'}} id='validation-basic-select3'>
                field is required
              </FormHelperText>
            )}
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
              name='address'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  value={value}
                  label='Address'
                  onChange={onChange}
                  placeholder='Address'
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && <FormHelperText sx={{color: 'error.main'}}>{errors.address.message}</FormHelperText>}
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
