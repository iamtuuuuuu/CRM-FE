import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Form, FormikProvider, useFormik } from 'formik'
import { LoadingButton } from '@mui/lab'
import departmentApi from 'src/apis/department.api'
import { useSnackbar } from 'notistack'

export default function AddDepartmentModal({
  open,
  handleClose,
  handleChangeDepartmentList,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const fetchCreateUser = async (values) => {
    try {
      await departmentApi.addDepartment(values)
      const res = await departmentApi.getAll()
      handleChangeDepartmentList(res)
    } catch (e) {
      if (e.statusCode === 403) {
        enqueueSnackbar('You must be ADMIN to create new department', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }
  const CreateDepartmentSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  })
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: CreateDepartmentSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchCreateUser(values)
      setSubmitting(false)
      resetForm()
    },
    enableReinitialize: true,
  })

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik
  return (
    <Dialog open={open} onClose={handleClose}>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <DialogTitle>Add new Department</DialogTitle>
          <DialogContent>
            <TextField
              margin='dense'
              id='name'
              label='Name'
              fullWidth
              variant='outlined'
              {...getFieldProps('name')}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
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
AddDepartmentModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeDepartmentList: PropTypes.func,
}
