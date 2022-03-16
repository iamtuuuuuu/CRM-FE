import PropTypes from 'prop-types'
// material
import { styled } from '@mui/material/styles'
import {
  TextField,
  Autocomplete,
  InputAdornment,
  OutlinedInput,
  IconButton,
  InputLabel,
} from '@mui/material'
// component
import Iconify from '../../../components/Iconify'
import { useState } from 'react'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '& .MuiAutocomplete-root': {
    width: 200,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
      width: 240,
      '& .MuiAutocomplete-inputRoot': {
        boxShadow: theme.customShadows.z12,
      },
    },
  },
  '& .MuiAutocomplete-inputRoot': {
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`,
    },
  },
  '& .MuiAutocomplete-option': {
    '&:not(:last-child)': {
      borderBottom: `solid 1px ${theme.palette.divider}`,
    },
  },
}))

// ----------------------------------------------------------------------

BlogPostsSearch.propTypes = {
  onSearchChange: PropTypes.func,
  search: PropTypes.string,
}

export default function BlogPostsSearch({ search, onSearchChange }) {
  return (
    <RootStyle>
      {/* <InputLabel htmlFor='search'>Search</InputLabel> */}
      <TextField
        onChange={onSearchChange}
        value={search}
        placeholder='Enter name of campaign...'
        label='Search'
      />
    </RootStyle>
  )
}
