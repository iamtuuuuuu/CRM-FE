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

const statusArray = [
  { value: 'active', text: 'Active' },
  { value: 'ban', text: 'Ban' },
]

export default function EditCampaignForCusModal({
  open,
  handleClose,
  campaign,
}) {
  const { enqueueSnackbar } = useSnackbar()

  const fetchEditCampaignForCustomer = async (values) => {
    try {
      await customerApi.editCampaignForCustomer(campaign.id, values)
      window.location.reload()
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
    handleClose()
  }
  const EditSchema = Yup.object().shape({
    status: Yup.string().required('Status is required'),
    note: Yup.string(),
  })
  const formik = useFormik({
    initialValues: {
      status: campaign?.status,
      note: campaign?.note,
    },
    validationSchema: EditSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchEditCampaignForCustomer(values)
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
              labelId='status'
              id='status'
              value={
                statusArray?.find(({ value }) => value === values.status)
                  ?.text || values?.status
              }
              label='Status'
              fullWidth
              onChange={(e) => {
                if (e.target.value) {
                  const object = statusArray.find(
                    ({ text }) => text === e.target.value
                  )
                  setFieldValue('status', object?.value)
                }
              }}
            >
              {statusArray?.map(({ text }) => (
                <MenuItem value={text} key={text}>
                  {text}
                </MenuItem>
              ))}
            </Select>
            <TextField
              margin='dense'
              id='note'
              label='Note'
              fullWidth
              multiline
              minRows={4}
              variant='outlined'
              {...getFieldProps('note')}
              error={Boolean(touched.note && errors.note)}
              helperText={touched.note && errors.note}
            />
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
EditCampaignForCusModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  campaign: PropTypes.object,
}
