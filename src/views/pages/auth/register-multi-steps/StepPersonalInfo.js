// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import FormHelperText from "@mui/material/FormHelperText";
import {useGetAllQuery, useGetOneQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {get} from "lodash";
import {useRouter} from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import {useEffect} from "react";

const StepPersonalDetails = ({handleNext, handlePrev}) => {
  const router = useRouter()
  const {data: companyData, isLoading: isLoadingCompanyData} = useGetOneQuery({
      id: get(router.query, 'companyId'),
      key: KEYS.company, url: URLS.company, params: {
        params: {
          populate: '*'
        },
        headers: {
          Authorization: `Bearer ${get(router.query, 'token')}`
        }
      },
      enabled: !!(get(router.query, 'token') && get(router.query, 'companyId'))
    }
  )
  const {data: companyCategory, isLoading: isLoadingCompanyCategory} = useGetAllQuery({
      key: KEYS.companyCategory, url: URLS.companyCategory, params: {
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

  const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
      key: KEYS.country, url: URLS.country, params: {
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

  const {mutate: createCompany, isLoading: isLoadingCompanyPost} = usePostQuery({
    url: URLS.company,
    hideSuccessToast: true
  })

  const defaultValues = {
    company_category: '',
    name: '',
    address: '',
    country: ''
  }

  const schema = yup.object().shape({
    company_category: yup.string().required(),
    name: yup.string().required(),
    address: yup.string().required(),
    country: yup.string().required(),
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

  const onSubmit = ({company_category, country, ...data}) => {
    if (get(companyData, 'data')) {
      handleNext()
    } else {
      createCompany({
        url: URLS.company,
        attributes: {
          data: {
            ...data,
            country: parseInt(country),
            company_category: parseInt(company_category),
            user: parseInt(get(router.query, 'userId'))
          }
        },
        config: {
          headers: {
            Authorization: `Bearer ${get(router.query, 'token')}`
          }
        }
      }, {
        onSuccess: ({data}) => {
          handleNext()
          router.replace({
            pathname: '/register',
            query: {
              token: get(router.query, 'token'),
              userId: get(router.query, 'userId'),
              companyId: get(data, 'data.id')
            }
          })
        },
        onError: (e) => {
          setError('company_category', {
            type: 'manual',
            message: e.response?.data?.error?.message || 'error'
          })
        }
      })
    }
  }
  useEffect(() => {
    if (get(companyData, 'data') && !isLoadingCompanyData) {
      reset({
        company_category: get(companyData, 'data.company_category.id'),
        name: get(companyData, 'data.name'),
        phone: get(companyData, 'data.phone'),
        country: get(companyData, 'data.country.id'),
        address: get(companyData, 'data.address'),
      })
    }
  }, [companyData])
  return (
    <div style={{position: 'relative'}}>
      {(isLoadingCompanyPost || isLoadingCompanyCategory || isLoadingCountry || isLoadingCompanyData) && <div style={{
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
        <Typography variant='h5'>Personal Information</Typography>
        <Typography sx={{color: 'text.secondary'}}>Enter Your Personal Information</Typography>
      </Box>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel
                id='validation-basic-select'
                error={Boolean(errors.company_category)}
                htmlFor='validation-basic-select'
              >
                Organization domain
              </InputLabel>
              <Controller
                name='company_category'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <Select
                    value={value}
                    label='Organization domain'
                    onChange={onChange}
                    error={Boolean(errors.company_category)}
                    labelId='validation-basic-select'
                    aria-describedby='validation-basic-select'
                  >
                    {
                      get(companyCategory, 'data.results', []).map(item => <MenuItem key={get(item, 'id')} value={
                        get(item, "id")
                      }>{get(item, "name")}</MenuItem>)
                    }
                  </Select>
                )}
              />
              {errors.company_category && (
                <FormHelperText sx={{color: 'error.main'}} id='validation-basic-select'>
                  field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='name'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange, onBlur}}) => (
                  <TextField
                    label='Organization name'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    placeholder='Organization name'
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='phone'
                control={control}
                render={({field: {value, onChange, onBlur}}) => (
                  <TextField
                    label='Mobile'
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
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
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
                      get(country, 'data.data', []).map(item => <MenuItem key={get(item, 'id')} value={
                        get(item, "id")
                      }>{get(item, "attributes.name")}</MenuItem>)
                    }
                  </Select>
                )}
              />
              {errors.company_category && (
                <FormHelperText sx={{color: 'error.main'}} id='validation-basic-select2'>
                  field is required
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name='address'
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange, onBlur}}) => (
                  <TextField
                    label='Address'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.address)}
                    placeholder='Address'
                  />
                )}
              />
              {errors.address && <FormHelperText sx={{color: 'error.main'}}>{errors.address.message}</FormHelperText>}
            </FormControl>
          </Grid>


          <Grid item xs={12}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Button
                color='secondary'
                variant='contained'
                onClick={handlePrev}
                startIcon={<Icon icon='mdi:chevron-left' fontSize={20}/>}
              >
                Previous
              </Button>
              <Button variant='contained' type={'submit'} endIcon={<Icon icon='mdi:chevron-right' fontSize={20}/>}>
                Next
              </Button>
            </Box>
          </Grid>

        </Grid>
      </form>
    </div>
  )
}

export default StepPersonalDetails
