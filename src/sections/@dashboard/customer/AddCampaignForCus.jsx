import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Input,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Form, FormikProvider, useFormik } from 'formik'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import campaignApi from 'src/apis/campaign.api'
import { customerApi } from 'src/apis/customer.api'

export default function AddCampaignForCusModal({
  open,
  handleClose,
  customer,
  handleChangeCampaignList,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [campaigns, setCampaigns] = useState([])
  const [imgData, setImgData] = useState(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await campaignApi.getAll()
        setCampaigns(res)
      } catch (e) {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    fetchCampaigns()
  }, [])

  const fetchAddCampaignForCustomer = async (values) => {
    try {
      await customerApi.addCampaignForCustomer(customer.id, values.campaignId)
      window.location.reload()
    } catch (e) {
      if (e.statusCode === 409) {
        enqueueSnackbar('Product have already taken', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }
  const AddCampaignSchema = Yup.object().shape({
    campaignId: Yup.number().required('Campaign is required'),
  })
  const formik = useFormik({
    initialValues: {
      campaignId: -1,
    },
    validationSchema: AddCampaignSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchAddCampaignForCustomer(values)
      setSubmitting(false)
      resetForm()
    },
    enableReinitialize: true,
  })

  const {
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    values,
  } = formik
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth={true}>
      <FormikProvider value={formik}>
        <Form
          autoComplete='off'
          noValidate
          onSubmit={handleSubmit}
          encType='multipart/form-data'
        >
          <DialogTitle>Add new Campaign</DialogTitle>
          <DialogContent>
            <Select
              sx={{ mt: 1 }}
              labelId='campaignId'
              id='campaignId'
              value={
                campaigns?.find(({ id }) => id === values.campaignId)?.name
              }
              label='Campaign'
              fullWidth
              onChange={(e) => {
                if (e.target.value) {
                  const object = campaigns.find(
                    ({ name }) => name === e.target.value
                  )
                  setFieldValue('campaignId', object?.id)
                }
              }}
            >
              {campaigns?.map(({ id, name }) => (
                <MenuItem value={name} key={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton
              size='medium'
              type='submit'
              variant='contained'
              loading={isSubmitting}
            >
              Add
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  )
}
AddCampaignForCusModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeCampaignList: PropTypes.func,
  customer: PropTypes.object,
}
