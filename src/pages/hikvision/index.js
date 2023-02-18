import { useState} from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import {styled} from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import {DataGrid} from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'
import {useDeleteQuery, useGetAllQuery} from "../../hooks/api";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import FallbackSpinner from "../../@core/components/spinner";
import {get, isNil} from "lodash";
import HikvisionCreateForm from "../../views/hikvision/create-form"
import HikvisionUpdateForm from "../../views/hikvision/update-form"
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

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
    field: 'ip',
    headerName: 'IP',
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'name',
    headerName: 'Name',
  },


]


const Hikvision = () => {
  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState([])
  const [show, setShow] = useState(false)
  const [id, setId] = useState(null)
  const [search, setSearch] = useState('')


  const {data, isLoading} = useGetAllQuery({
    key: KEYS.hikvision, url: URLS.hikvision, params: {
      populate: '*',
      filters: {
        name: {
          $startsWith: search
        }
      }
    }
  })

  const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.hikvision})


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
          <Tooltip title='View'>
            <IconButton size='small' component={Link} sx={{mr: 0.5}} href={`#`}>
              <Icon icon='mdi:eye-outline'/>
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
  ];

  const deleteItem = (id) => {
    deleteRequest({
      url: `${URLS.hikvision}/${id}`
    })
  }

  if (isLoading) {
    return <FallbackSpinner/>;
  }


  return (
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
      <HikvisionCreateForm open={show} toggle={setShow}/>
      <HikvisionUpdateForm id={id} open={!isNil(id)} toggle={() => setId(null)}/>
    </Grid>
  )
}

export default Hikvision
