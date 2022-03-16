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

export default function EditDepartmentModal({
  open,
  handleClose,
  handleChangeDepartmentList,
  department,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const fetchEditDepartment = async (values) => {
    try {
      await departmentApi.editDepartment(department.id, values)
      const res = await departmentApi.getAll()
      handleChangeDepartmentList(res)
    } catch (e) {
      if (e.statusCode === 403) {
        enqueueSnackbar('You must be ADMIN to update department', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }

  const CreateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  })
  const formik = useFormik({
    initialValues: {
      name: department?.name,
    },
    validationSchema: CreateUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchEditDepartment(values)
      setSubmitting(false)
      resetForm()
    },
    enableReinitialize: true,
  })

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik
  return (
    <Dialog open={open} onClose={handleClose}>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <DialogTitle>Edit Department</DialogTitle>
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
              value={values.name}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton
              size='large'
              type='submit'
              variant='contained'
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  )
}
EditDepartmentModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeDepartmentList: PropTypes.func,
  department: PropTypes.object,
}
