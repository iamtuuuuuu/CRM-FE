import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
} from '@mui/material'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Form, FormikProvider, useFormik } from 'formik'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import departmentApi from 'src/apis/department.api'
import employeeApi from 'src/apis/employee.api'

const enableOptions = [
  { id: 'active', text: 'Active' },
  { id: 'ban', text: 'Ban' },
]

export default function EditUserModal({
  open,
  handleClose,
  handleChangeUserList,
  user,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [department, setDepartment] = useState([])

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await departmentApi.getAll()
        setDepartment(res)
      } catch (e) {
        enqueueSnackbar(`${e.error}: ${e.message}`, {
          variant: 'error',
        })
      }
    }
    fetchDepartment()
  }, [])

  const fetchEditUser = async (values) => {
    try {
      await employeeApi.editEmployee(user?.id, values)
      const res = await employeeApi.getAllEmployee()
      handleChangeUserList(res)
    } catch (e) {
      if (e.statusCode === 403) {
        enqueueSnackbar('You must be ADMIN to update employee', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }

  const CreateUserSchema = Yup.object().shape({
    status: Yup.string().required('Status is required'),
    departmentName: Yup.string().required('Department is required'),
  })
  const formik = useFormik({
    initialValues: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      status: user?.status,
      departmentName: department?.find(
        ({ name }) => name === user?.departmentName
      )?.id,
    },
    validationSchema: CreateUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const data = {
        status: values?.status,
        departmentId: values?.departmentName,
      }
      await fetchEditUser(data)
      setSubmitting(false)
      resetForm()
    },
    enableReinitialize: true,
  })

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik
  return (
    <Dialog open={open} onClose={handleClose}>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='id'
              label='Id'
              fullWidth
              variant='outlined'
              {...getFieldProps('id')}
              error={Boolean(touched.id && errors.id)}
              helperText={touched.id && errors.id}
              value={values.id}
              disabled={true}
            />
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Name'
              fullWidth
              variant='outlined'
              {...getFieldProps('name')}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
              value={values.name}
              disabled={true}
            />
            <TextField
              margin='dense'
              id='email'
              label='Email Address'
              type='email'
              fullWidth
              variant='outlined'
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              value={values.email}
              disabled={true}
            />
            <TextField
              margin='dense'
              id='phoneNumber'
              label='Phone Number'
              fullWidth
              variant='outlined'
              {...getFieldProps('phoneNumber')}
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
              value={values.phoneNumber}
              disabled={true}
            />
            <Select
              labelId='Enbale Option'
              id='Enbale Option'
              value={enableOptions.find(({ id }) => id === values.status)?.text}
              label='Status'
              fullWidth
              onChange={(e) => {
                if (e.target.value) {
                  const object = enableOptions.find(
                    ({ text }) => text === e.target.value
                  )
                  setFieldValue('status', object?.id)
                }
              }}
            >
              {enableOptions.map(({ text }) => (
                <MenuItem value={text} key={text}>
                  {text}
                </MenuItem>
              ))}
            </Select>
            <Select
              labelId='Department'
              id='departmentName'
              value={
                department?.find(({ id }) => id === values.departmentName)
                  ?.name || values?.departmentName
              }
              label='Department'
              fullWidth
              onChange={(e) => {
                if (e.target.value) {
                  const object = department.find(
                    ({ name }) => name === e.target.value
                  )
                  setFieldValue('departmentName', object?.id)
                }
              }}
            >
              {department?.map(({ name }) => (
                <MenuItem value={name} key={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
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
EditUserModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeUserList: PropTypes.func,
  user: PropTypes.object,
}
