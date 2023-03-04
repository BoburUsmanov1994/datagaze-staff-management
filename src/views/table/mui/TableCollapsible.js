// ** React Imports
import {useState, Fragment} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {get, head, last} from "lodash"
import dayjs from "dayjs";

const createData = (name, calories, fat, carbs, protein, price) => {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  }
}

const Row = props => {
  // ** Props
  const {row} = props

  // ** State
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}/>
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {get(row, 'employee.first_name')}
        </TableCell>
        <TableCell>{dayjs(get(head(get(row, 'events', [])), 'time')).format("DD-MM-YYYY HH:mm")}</TableCell>
        <TableCell
          align={'right'}>{dayjs(get(last(get(row, 'events', [])), 'time')).format("DD-MM-YYYY HH:mm")}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{py: '0 !important'}}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{m: 2}}>
              <Typography variant='h6' gutterBottom component='div'>
                History
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {get(row, 'events', []).map(event => (
                    <TableRow key={get(event, 'id')}>
                      <TableCell component='th' scope='row'>
                        {get(event, 'date')}
                      </TableCell>
                      <TableCell>{dayjs(get(event, 'time')).format("DD-MM-YYYY HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
]

const TableCollapsible = ({data = []}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell/>
            <TableCell>Employee</TableCell>
            <TableCell>Check in</TableCell>
            <TableCell align='right'>Check out</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <Row key={i} row={row}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCollapsible
