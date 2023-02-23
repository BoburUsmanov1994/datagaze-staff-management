// ** React Imports
import {useState} from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import {styled} from '@mui/material/styles'
import {DataGrid} from '@mui/x-data-grid'
import {useRouter} from 'next/router'


import TableHeader from 'src/views/apps/invoice/list/TableHeader'

import {useGetAllQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {get} from "lodash";
import FallbackSpinner from "../../../@core/components/spinner";

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
    field: 'major',
    headerName: 'Major',
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'minor',
    headerName: 'Minor',
  },

  {
    flex: 0.1,
    minWidth: 90,
    field: 'time',
    headerName: 'Time',
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
    field: 'doorNo',
    headerName: 'Door nomer',
  },

]


/* eslint-enable */
const EmployeeView = () => {
  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState([])
  const [search, setSearch] = useState('')
  const router = useRouter()


  const {data, isLoading} = useGetAllQuery({
    key: KEYS.hikvisionLogs, url: URLS.hikvisionLogs, params: {
      populate: '*',
      filters: {
        employee: {
          id: {
            $eq: router.query?.id
          }
        },
      }
    }
  })


  const columns = [
    ...defaultColumns,
  ]


  if (isLoading) {
    return <FallbackSpinner/>;
  }
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Card>
              <TableHeader setShow={null} value={search} selectedRows={selectedRows} handleFilter={setSearch}/>
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
      </Grid>
    </>
  )
}

export default EmployeeView;
