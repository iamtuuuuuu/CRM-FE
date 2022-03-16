import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Form, FormikProvider, useFormik } from 'formik'
import { LoadingButton } from '@mui/lab'
import departmentApi from 'src/apis/department.api'
import { useSnackbar } from 'notistack'
import { customerApi } from 'src/apis/customer.api'

const genders = [
  { value: 'male', text: 'Male' },
  { value: 'female', text: 'Female' },
  { value: 'other', text: 'Other' },
]

export default function AddCustomerModal({
  open,
  handleClose,
  handleChangeCustomerList,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const fetchCreateCustomer = async (values) => {
    try {
      await customerApi.create(values)
      const res = await customerApi.getAll()
      handleChangeCustomerList(res)
    } catch (e) {
      if (e.statusCode === 409) {
        enqueueSnackbar('Error: Customer info have already taken', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }
  const CreateCustomerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(
        /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        'Phone number must be a valid phone number'
      )
      .required('Phone number required'),
    dob: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
  })
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      dob: '',
      gender: '',
      address: '',
    },
    validationSchema: CreateCustomerSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchCreateCustomer(values)
      console.log({ values })
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
    values,
    setFieldValue,
  } = formik
  return (
    <Dialog open={open} onClose={handleClose}>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <DialogTitle>Add new Customer</DialogTitle>
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
            <TextField
              margin='dense'
              id='email'
              label='Email'
              fullWidth
              variant='outlined'
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
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
            />
            <TextField
              sx={{ mt: 1, mb: 1 }}
              id='dob'
              label='Birthday'
              type='date'
              defaultValue={new Date()}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              {...getFieldProps('dob')}
              error={Boolean(touched.dob && errors.dob)}
              helperText={touched.dob && errors.dob}
            />
            <Select
              labelId='gender'
              id='gender'
              value={
                genders?.find(({ value }) => value === values.gender)?.text
              }
              label='Gender'
              fullWidth
              onChange={(e) => {
                if (e.target.value) {
                  const object = genders.find(
                    ({ text }) => text === e.target.value
                  )
                  setFieldValue('gender', object?.value)
                }
              }}
            >
              {genders?.map(({ text }) => (
                <MenuItem value={text} key={text}>
                  {text}
                </MenuItem>
              ))}
            </Select>

            <TextField
              margin='dense'
              id='address'
              label='Address'
              fullWidth
              variant='outlined'
              {...getFieldProps('address')}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
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
AddCustomerModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeCustomerList: PropTypes.func,
}
