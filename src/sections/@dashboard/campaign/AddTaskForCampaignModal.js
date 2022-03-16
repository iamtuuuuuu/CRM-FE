import React, { useEffect, useState } from 'react'
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
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Form, FormikProvider, useFormik } from 'formik'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import taskApi from 'src/apis/task.api'
import productApi from 'src/apis/product.api'
import campaignApi from 'src/apis/campaign.api'

export default function AddTaskForCampaignModal({
  open,
  handleClose,
  handleChangeTaskList,
  campaign,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await taskApi.getAllTask()
        setTasks(res)
      } catch (e) {
        enqueueSnackbar(`${e.error}: ${e.message}`, {
          variant: 'error',
        })
      }
    }
    fetchTask()
  }, [])

  const fetchAddTaskForCampaign = async (values) => {
    try {
      await campaignApi.addTask(campaign.id, values)
      const res = await campaignApi.getTasks(campaign.id)
      handleChangeTaskList(res)
    } catch (e) {
      if (e.statusCode === 403) {
        enqueueSnackbar('You must be ADMIN to add new task', {
          variant: 'error',
        })
      } else if (e.statusCode === 409) {
        enqueueSnackbar('This task have already in campaign', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }
  const CreateTaskSchema = Yup.object().shape({
    id: Yup.number().required('Task is required'),
  })
  const formik = useFormik({
    initialValues: {
      id: -1,
    },
    validationSchema: CreateTaskSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await fetchAddTaskForCampaign(values)
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
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <FormikProvider value={formik}>
        <Form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <DialogTitle>Add Task For Product</DialogTitle>
          <DialogContent>
            <Select
              labelId='Enbale Option'
              id='Enbale Option'
              value={tasks.find(({ id }) => id === values.id)?.name}
              label='Task'
              fullWidth
              onChange={(e) => {
                if (e.target.value) {
                  const object = tasks.find(
                    ({ name }) => name === e.target.value
                  )
                  setFieldValue('id', object?.id)
                }
              }}
            >
              {tasks.map(({ name }) => (
                <MenuItem value={name} key={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
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
AddTaskForCampaignModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeTaskList: PropTypes.func,
  campaign: PropTypes.object,
}
