// ** React Imports
import {useState} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import {styled} from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import {DataGrid} from '@mui/x-data-grid'


import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {useDeleteQuery, useGetAllQuery} from "../../hooks/api";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import {get, isNil} from "lodash";
import FallbackSpinner from "../../@core/components/spinner";
import CompanyCategoryCreateForm from "../../views/company-category/create-form";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Icon from "../../@core/components/icon";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CompanyCategoryUpdateForm from "../../views/company-category/update-form";

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
    field: 'locale',
    headerName: 'Locale',
  },
]


/* eslint-enable */
const CompanyCategoryList = () => {
  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [id, setId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([])
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('')

  const {data, isLoading} = useGetAllQuery({
    key: KEYS.companyCategory, url: URLS.companyCategory, params: {
      populate: '*',
      filters: {
        name: {
          $startsWith: search
        },
        locale: {
          $startsWith: search
        }
      },
      pagination: {
        pageSize: 100
      }
    }
  })


  const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.companyCategory})


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
      url: `${URLS.companyCategory}/${id}`
    })
  }

  if (isLoading) {
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
            <CardHeader title='Company category'/>
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
        <CompanyCategoryCreateForm open={show} toggle={setShow}/>
        <CompanyCategoryUpdateForm id={id} open={!isNil(id)} toggle={() => setId(null)}/>
      </Grid>
    </DatePickerWrapper>
  )
}

export default CompanyCategoryList;
