// ** React Imports
import {useState} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import {styled} from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import {DataGrid} from '@mui/x-data-grid'
import Select from '@mui/material/Select'


import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {useGetAllQuery} from "../../hooks/api";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import {get} from "lodash";
import FallbackSpinner from "../../@core/components/spinner";
import dayjs from "dayjs";

// ** Styled component for the link in the dataTable
const StyledLink = styled(Link)(({theme}) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))


const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: '#',
    renderCell: ({row}) => <StyledLink href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</StyledLink>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'company',
    headerName: 'Company',
    renderCell: ({row}) => get(row, 'company.name', '-')
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'employee',
    headerName: 'Employee',
    renderCell: ({row}) => get(row, 'employee.hostname', '-')
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


/* eslint-enable */
const ProductivityList = () => {
  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState([])
  const [handleFilter, setHandleFilter] = useState({
    companyId: undefined,
    employeeId: undefined
  })

  const {data, isLoading} = useGetAllQuery({
    key: KEYS.productivity, url: URLS.productivity, params: {
      populate: '*',
      filters: {
        company: {
          id: {
            $eq: get(handleFilter, 'companyId')
          }
        },
        employee: {
          id: {
            $eq: get(handleFilter, 'employeeId')
          }
        }
      }
    }
  })
  const {data: company, isLoading: isLoadingCompany} = useGetAllQuery({
    key: KEYS.company, url: URLS.company, params: {
      populate: '*',
    }
  })
  const {data: employees, isLoading: isLoadingEmployee} = useGetAllQuery({
    key: KEYS.employee, url: URLS.employee, params: {
      populate: '*',
    }
  })


  const columns = [
    ...defaultColumns
  ]


  if (isLoading || isLoadingCompany || isLoadingEmployee) {
    return <FallbackSpinner/>;
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters'/>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='company-status-select'>Select company</InputLabel>
                    <Select
                      fullWidth
                      value={get(handleFilter, 'companyId')}
                      sx={{mr: 4, mb: 2}}
                      label='Select company'
                      onChange={(e) => setHandleFilter(prev => ({...prev, departmentId: e.target.value}))}
                      labelId='company-status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                      {
                        get(company, 'data.results', []).map(item => <MenuItem key={get(item, 'id')}
                                                                               value={get(item, 'id')}>{get(item, 'name')}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='employee-status-select'>Employee</InputLabel>

                    <Select
                      fullWidth
                      value={get(handleFilter, 'employeeId')}
                      sx={{mr: 4, mb: 2}}
                      label='Select employee'
                      onChange={(e) => setHandleFilter(prev => ({...prev, employeeId: e.target.value}))}
                      labelId='employee-status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                      {
                        get(employees, 'data.results', []).map(item => <MenuItem key={get(item, 'id')}
                                                                                 value={get(item, 'id')}>{get(item, 'name')}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={''} selectedRows={selectedRows} handleFilter={handleFilter}/>
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
      </Grid>
    </DatePickerWrapper>
  )
}

export default ProductivityList
