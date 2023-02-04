// ** React Imports
import {useState, useEffect, forwardRef} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import {styled} from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import {DataGrid} from '@mui/x-data-grid'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import {useDispatch, useSelector} from 'react-redux'
import {fetchData, deleteInvoice} from 'src/store/apps/invoice'


import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {useGetAllQuery} from "../../hooks/api";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import FallbackSpinner from "../../@core/components/spinner";
import {get} from "lodash";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import GuestPermitCreateForm from "../../views/guest-permit/create-form"

const StyledLink = styled(Link)(({theme}) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})


const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: '#',
    renderCell: ({row}) => <StyledLink href={`/guest-permit/view/${row.id}`}>{`#${row.id}`}</StyledLink>
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'guestName',
    headerName: 'Guest name',
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: 'visitPurpose',
    headerName: 'Visit purpose',
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'company',
    headerName: 'Company',
    renderCell: ({row}) =>get(row,'company.name','-')
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'check_in',
    headerName: 'Check in',
    renderCell: ({row}) => dayjs(row.check_in).format("DD-MM-YYYY HH:mm")
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'check_out',
    headerName: 'Check out',
    renderCell: ({row}) => dayjs(row.check_out).format("DD-MM-YYYY HH:mm")
  },

]
/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = {...props}
  delete updatedProps.setDates
  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value}/>
})

/* eslint-enable */
const GuestList = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [companyValue, setCompanyValue] = useState(undefined)
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [show, setShow] = useState(false)


  const {data, isLoading} = useGetAllQuery({
    key: KEYS.permits, url: URLS.permits, params: {
      populate: '*',
      filters: {
        company: {
          id: {
            $eq: companyValue
          }
        }
      }
    }
  })
  const {data: company, isLoading: isLoadingCompany} = useGetAllQuery({
    key: KEYS.company, url: URLS.company
  })


  const handleFilter = val => {
    setValue(val)
  }

  const handleCompanyValue = e => {
    setCompanyValue(e.target.value)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({row}) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Tooltip title='Delete Invoice'>
            <IconButton size='small' sx={{mr: 0.5}} >
              <Icon icon='mdi:delete-outline'/>
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton size='small' component={Link} sx={{mr: 0.5}} href={`#`}>
              <Icon icon='mdi:eye-outline'/>
            </IconButton>
          </Tooltip>
          <OptionsMenu
            iconProps={{fontSize: 20}}
            iconButtonProps={{size: 'small'}}
            menuProps={{sx: {'& .MuiMenuItem-root svg': {mr: 2}}}}
            options={[
              {
                text: 'Download',
                icon: <Icon icon='mdi:download' fontSize={20}/>
              },
              {
                text: 'Edit',
                href: `#`,
                icon: <Icon icon='mdi:pencil-outline' fontSize={20}/>
              },
              {
                text: 'Duplicate',
                icon: <Icon icon='mdi:content-copy' fontSize={20}/>
              }
            ]}
          />
        </Box>
      )
    }
  ]


  if (isLoading || isLoadingCompany) {
    return <FallbackSpinner/>;
  }

  return (


      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters'/>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Company</InputLabel>
                    <Select
                      fullWidth
                      value={companyValue}
                      sx={{mr: 4, mb: 2}}
                      label='Invoice Status'
                      onChange={handleCompanyValue}
                      labelId='invoice-status-select'
                    >
                      <MenuItem value={''}>None</MenuItem>
                      {
                        get(company, 'data.results', []).map(item => <MenuItem key={get(item, 'id')}
                                                                               value={get(item, 'id')}>{get(item, 'name')}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Invoice Date'
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader setShow={setShow} value={value} selectedRows={selectedRows} handleFilter={handleFilter}/>
            <DataGrid
              autoHeight
              pagination
              rows={get(data, 'data.results', [])}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
              pageSize={Number(pageSize)}
              rowsPerPageOptions={[10, 25, 50]}
              onSelectionModelChange={rows => setSelectedRows(rows)}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
        </Grid>
        <GuestPermitCreateForm open={show} toggle={setShow}/>
      </Grid>

  )
}

export default GuestList
