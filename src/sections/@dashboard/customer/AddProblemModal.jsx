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

export default function AddProblemForCusModal({ open, handleClose, customer }) {
  const { enqueueSnackbar } = useSnackbar()

  const fetchAddProblemForCustomer = async (values) => {
    try {
      await customerApi.addProblem(customer.id, values)
      window.location.reload()
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
    handleClose()
  }
  const AddProblemSchema = Yup.object().shape({
    description: Yup.string().required('Campaign is required'),
    note: Yup.string(),
  })
  const formik = useFormik({
    initialValues: {
      description: '',
      note: '',
    },
    validationSchema: AddProblemSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchAddProblemForCustomer(values)
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
            <TextField
              margin='dense'
              id='description'
              label='Description'
              fullWidth
              multiline
              minRows={4}
              variant='outlined'
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
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
AddProblemForCusModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  customer: PropTypes.object,
}
