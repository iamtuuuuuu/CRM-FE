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
import taskApi from 'src/apis/task.api'

export default function EditTaskModal({
  open,
  handleClose,
  handleChangeTaskList,
  task,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const fetchEditTask = async (values) => {
    try {
      await taskApi.updateTask(task.id, values)
      if (
        window.location.href.includes('product') ||
        window.location.href.includes('campaign')
      ) {
        window.location.reload()
      } else {
        const res = await taskApi.getAllTask()
        handleChangeTaskList(res)
      }
    } catch (e) {
      if (e.statusCode === 403) {
        enqueueSnackbar('You must be ADMIN to update task', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }

  const UpdateTaskSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
  })
  const formik = useFormik({
    initialValues: {
      name: task?.name,
      description: task?.description,
    },
    validationSchema: UpdateTaskSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchEditTask(values)
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
          <DialogTitle>Edit Task</DialogTitle>
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
            <TextField
              margin='dense'
              id='description'
              label='Description'
              fullWidth
              variant='outlined'
              {...getFieldProps('description')}
              error={Boolean(touched.nadescriptionme && errors.description)}
              helperText={touched.description && errors.description}
              value={values.description}
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
EditTaskModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeTaskList: PropTypes.func,
  task: PropTypes.object,
}
