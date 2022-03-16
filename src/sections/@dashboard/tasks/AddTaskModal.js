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
import { useSnackbar } from 'notistack'
import taskApi from 'src/apis/task.api'

export default function AddTaskModal({
  open,
  handleClose,
  handleChangeTaskList,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const fetchCreateTask = async (values) => {
    try {
      await taskApi.createTask(values)
      const res = await taskApi.getAllTask()
      handleChangeTaskList(res)
    } catch (e) {
      if (e.statusCode === 403) {
        enqueueSnackbar('You must be ADMIN to create new task', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }
  const CreateTaskSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
  })
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: CreateTaskSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchCreateTask(values)
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
          <DialogTitle>Add new Task</DialogTitle>
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
              id='description'
              label='Description'
              fullWidth
              variant='outlined'
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
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
AddTaskModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeTaskList: PropTypes.func,
}
