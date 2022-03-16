import PropTypes from 'prop-types'
// material
import { styled } from '@mui/material/styles'
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
} from '@mui/material'
// component
import Iconify from '../../../components/Iconify'
import { customerApi } from 'src/apis/customer.api'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}))

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}))

// ----------------------------------------------------------------------

CustomerCampaignListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selectedList: PropTypes.array,
  setSelected: PropTypes.func,
  handleChangeCampaignList: PropTypes.func,
}

export default function CustomerCampaignListToolbar({
  numSelected,
  filterName,
  onFilterName,
  selectedList,
  setSelected,
  handleChangeCampaignList,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  console.log(selectedList)
  const handleDelete = async () => {
    const isConfirm = window.confirm('Are you sure about that?')
    if (isConfirm) {
      try {
        console.log({ ids: selectedList })
        await customerApi.removeCampaignForCustomer(id, selectedList)
        const res = await customerApi.getCampaignOfCustomer(id)
        setSelected([])
        handleChangeCampaignList(res)
      } catch (e) {
        if (e.statusCode === 403) {
          enqueueSnackbar('You must be ADMIN to delete campaign of customer', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      }
    }
  }

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component='div' variant='subtitle1'>
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder='Search name...'
          startAdornment={
            <InputAdornment position='start'>
              <Iconify icon='eva:search-fill' sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton onClick={handleDelete}>
            <Iconify icon='eva:trash-2-fill' />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <Iconify icon='ic:round-filter-list' />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  )
}
