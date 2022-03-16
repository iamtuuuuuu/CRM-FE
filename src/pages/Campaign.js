import { Link as RouterLink } from 'react-router-dom'
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material'
// components
import Page from '../components/Page'
import Iconify from '../components/Iconify'
import {
  BlogPostCard,
  BlogPostsSort,
  BlogPostsSearch,
} from '../sections/@dashboard/campaign'
//
import POSTS from '../_mocks_/blog'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import AddCampaignModal from 'src/sections/@dashboard/campaign/AddCampaignModal'
import campaignApi from 'src/apis/campaign.api'

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Stop', label: 'Stop' },
  { value: 'Done', label: 'Done' },
]

// ----------------------------------------------------------------------

export default function Campaign() {
  const { enqueueSnackbar } = useSnackbar()

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [campaign, setCampaign] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await campaignApi.getAll()
        setCampaign(res)
      } catch (e) {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    fetchCampaign()
  }, [])

  const filterCampaign = async (filter) => {
    try {
      const res = await campaignApi.getAll({ filter: filter })
      setCampaign(res)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  const handleCampaignChange = (campaign) => {
    setCampaign(campaign)
  }

  const handleAddFormOpen = () => {
    setIsAddFormOpen(true)
  }

  const handleAddFormClose = () => {
    setIsAddFormOpen(false)
  }

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }



  const handleFilterCampaign = (filter) => {
    if (filter !== 'All') {
      filterCampaign(filter)
    } else {
      filterCampaign()
    }
  }

  return (
    <Page title='Dashboard: Campaign | Minimal-UI'>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Campaign
          </Typography>
          <Button
            onClick={handleAddFormOpen}
            variant='contained'
            component={RouterLink}
            to='#'
            startIcon={<Iconify icon='eva:plus-fill' />}
          >
            New Campaign
          </Button>
        </Stack>

        <Stack
          mb={5}
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <BlogPostsSearch
            search={searchTerm}
            onSearchChange={onSearchChange}
          />
          <BlogPostsSort
            options={SORT_OPTIONS}
            onFilter={handleFilterCampaign}
          />
        </Stack>

        <Grid container spacing={3}>
          {campaign?.map((cam, index) => (
            <BlogPostCard key={cam.id} campaign={cam} index={index} />
          ))}
        </Grid>
      </Container>
      <AddCampaignModal
        open={isAddFormOpen}
        handleClose={handleAddFormClose}
        handleChangeCampaignList={handleCampaignChange}
      />
    </Page>
  )
}
