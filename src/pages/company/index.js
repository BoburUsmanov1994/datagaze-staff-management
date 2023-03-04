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
import {useDeleteQuery, useGetAllQuery} from "../../hooks/api";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import {get, isNil} from "lodash";
import FallbackSpinner from "../../@core/components/spinner";
import CompanyCreateForm from "../../views/company/create-form";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Icon from "../../@core/components/icon";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CompanyUpdateForm from "../../views/company/update-form";

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
    renderCell: ({row}) => <StyledLink href={`#`}>{`#${row.id}`}</StyledLink>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'name',
    headerName: 'Name',
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'company_category',
    headerName: 'Company category',
    renderCell: ({row}) => get(row, 'company_category.name')
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'address',
    headerName: 'Address',
  },
]


/* eslint-enable */
const CompanyList = () => {
  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [id, setId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([])
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('')
  const [handleFilter, setHandleFilter] = useState({
    companyCategoryId: undefined,
  })

  const {data, isLoading} = useGetAllQuery({
    key: KEYS.company, url: URLS.company, params: {
      populate: '*',
      filters: {
        companyCategory: {
          id: {
            $eq: get(handleFilter, 'companyCategoryId')
          }
        },
        name: {
          $startsWith: search
        },
        address: {
          $startsWith: search
        }
      },
      pagination: {
        pageSize: 100
      }
    }
  })
  const {data: companyCategoryList, isLoading: isLoadingCompanyCategory} = useGetAllQuery({
    key: KEYS.companyCategory, url: URLS.companyCategory, params: {
      populate: '*',
    }
  })

  const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.company})


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
          <Tooltip title='Delete'>
            <IconButton onClick={() => deleteItem(get(row, 'id'))} size='small' sx={{mr: 0.5}}>
              <Icon icon='mdi:delete-outline'/>
            </IconButton>
          </Tooltip>
          <Tooltip title='Update'>
            <IconButton onClick={() => setId(get(row, 'id'))} size='small' sx={{mr: 0.5}}>
              <Icon icon='mdi:edit'/>
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const deleteItem = (id) => {
    deleteRequest({
      url: `${URLS.company}/${id}`
    })
  }

  if (isLoading || isLoadingCompanyCategory) {
    return <FallbackSpinner/>;
  }


  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {(deleteLoading) && <div style={{
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
          <Card>
            <CardHeader title='Filters'/>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={4} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Select company category</InputLabel>
                    <Select
                      fullWidth
                      value={get(handleFilter, 'companyCategoryId')}
                      sx={{mr: 4, mb: 2}}
                      label='Select company category'
                      onChange={(e) => setHandleFilter(prev => ({...prev, companyCategoryId: e.target.value}))}
                      labelId='department-status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                      {
                        get(companyCategoryList, 'data.results', []).map(item => <MenuItem key={get(item, 'id')}
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
            <TableHeader setShow={setShow} value={search} selectedRows={selectedRows} handleFilter={setSearch}/>
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
        <CompanyCreateForm open={show} toggle={setShow}/>
        <CompanyUpdateForm id={id} open={!isNil(id)} toggle={() => setId(null)}/>
      </Grid>
    </DatePickerWrapper>
  )
}

export default CompanyList;
