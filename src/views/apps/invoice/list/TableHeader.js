// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import {isNil} from "lodash"
import {useForm} from "react-hook-form";
import {useState} from "react";

const TableHeader = props => {
  const {value, selectedRows, handleFilter, setShow = null} = props
  const [search, setSearch] = useState(value)
  const {handleSubmit} = useForm()

  const onSubmit = () => {
    handleFilter(search)
  }
  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Select
        size='small'
        displayEmpty
        defaultValue=''
        sx={{mr: 4, mb: 2}}
        disabled={selectedRows && selectedRows.length === 0}
        renderValue={selected => (selected.length === 0 ? 'Actions' : selected)}
      >
        <MenuItem disabled>Actions</MenuItem>
        <MenuItem value='Delete'>Delete</MenuItem>
        <MenuItem value='Edit'>Edit</MenuItem>
        <MenuItem value='Send'>Send</MenuItem>
      </Select>
      <Box sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            size='small'
            value={search}
            placeholder='Search'
            sx={{mr: 4, mb: 2, maxWidth: '180px'}}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        {!isNil(setShow) && <Button sx={{mb: 2}} onClick={() => setShow(true)} variant='contained'>
          Create
        </Button>}
      </Box>
    </Box>
  )
}

export default TableHeader
