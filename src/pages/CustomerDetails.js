import {
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
} from '@mui/material'
import * as React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import Page from 'src/components/Page'
import Iconify from '../components/Iconify'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { customerApi } from 'src/apis/customer.api'
import CustomerCampaign from 'src/sections/@dashboard/customer/CustomerCampaign'
import CustomerEmail from 'src/sections/@dashboard/customer/CustomerEmail'
import CustomerProblem from 'src/sections/@dashboard/customer/CustomerProblem'

// ---------
const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <SectionStyle
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </SectionStyle>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

export default function CustomerDetails() {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [value, setValue] = React.useState(0)
  const [customer, setCustomer] = React.useState({})

  React.useLayoutEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await customerApi.getOne(id)
        setCustomer(res)
      } catch (error) {
        enqueueSnackbar(error.error, { variant: 'error' })
      }
    }
    fetchCustomer()
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <Page title='Customer Details'>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Customer Details
          </Typography>
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab label='Campaign' icon={<Iconify icon='eva:people-fill' />} />
              <Tab
                label='Email'
                icon={<Iconify icon='dashicons:email-alt' />}
              />
              <Tab
                label='Problems'
                icon={<Iconify icon='ic:round-report-problem' />}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <CustomerCampaign customer={customer} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CustomerEmail customer={customer} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <CustomerProblem customer={customer} />
          </TabPanel>
        </Box>
      </Container>
    </Page>
  )
}
