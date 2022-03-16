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

export default function EditProblemForCusModal({ open, handleClose, problem }) {
  const { enqueueSnackbar } = useSnackbar()

  const fetchEditProblemForCustomer = async (values) => {
    try {
      await customerApi.editProblem(problem.id, values)
      window.location.reload()
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
    handleClose()
  }
  const EditProblemSchema = Yup.object().shape({
    description: Yup.string().required('description is required'),
    note: Yup.string(),
  })
  const formik = useFormik({
    initialValues: {
      description: problem?.description,
      note: problem?.note,
    },
    validationSchema: EditProblemSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchEditProblemForCustomer(values)
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
EditProblemForCusModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  problem: PropTypes.object,
}
