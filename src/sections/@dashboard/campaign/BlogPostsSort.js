import PropTypes from 'prop-types'
// material
import { MenuItem, TextField } from '@mui/material'
import { useState } from 'react'

// ----------------------------------------------------------------------

BlogPostsSort.propTypes = {
  options: PropTypes.array,
  onFilter: PropTypes.func,
}

export default function BlogPostsSort({ options, onFilter }) {
  const [filter, setFilter] = useState('All')
  const handleFilter = (e) => {
    setFilter(e.target.value)
    onFilter(e.target.value)
  }
  return (
    <TextField select size='small' value={filter} onChange={handleFilter}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
