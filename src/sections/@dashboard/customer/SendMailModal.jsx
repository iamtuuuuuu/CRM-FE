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

export default function SendMail({ open, handleClose, customer }) {
  const { enqueueSnackbar } = useSnackbar()

  const fetchSendMail = async (values) => {
    try {
      await customerApi.sendMail(customer.id, { content: values.content })
      window.location.reload()
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
    handleClose()
  }
  const mailSchema = Yup.object().shape({
    content: Yup.string().required('Content is required'),
  })
  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: mailSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchSendMail(values)
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
          <DialogTitle>New Message</DialogTitle>
          <DialogContent>
            <TextField
              margin='dense'
              id='content'
              label='Content'
              fullWidth
              multiline
              minRows={5}
              variant='outlined'
              {...getFieldProps('content')}
              error={Boolean(touched.content && errors.content)}
              helperText={touched.content && errors.content}
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
SendMail.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  customer: PropTypes.object,
}
