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

export default function AddCampaignModal({
  open,
  handleClose,
  handleChangeCampaignList,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [campaignStatus, setCampaignStatus] = useState([])
  const [imgData, setImgData] = useState(null)

  useEffect(() => {
    const fetchCampaignStatus = async () => {
      try {
        const res = await campaignApi.getCampaignStatus()
        setCampaignStatus(res)
      } catch (e) {
        if (e.statusCode === 403) {
          enqueueSnackbar('You must be ADMIN to create new campaign', {
            variant: 'error',
          })
        } else {
          enqueueSnackbar(e.message, { variant: 'error' })
        }
      }
    }
    fetchCampaignStatus()
  }, [])

  const fetchCreateCampaign = async (values) => {
    try {
      await campaignApi.create(values)
      const res = await campaignApi.getAll()
      handleChangeCampaignList(res)
    } catch (e) {
      if (e.statusCode === 403) {
        enqueueSnackbar('You must be ADMIN to create new campaign', {
          variant: 'error',
        })
      } else {
        enqueueSnackbar(e.message, { variant: 'error' })
      }
    }
    handleClose()
  }
  const CreateCampaignSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    campaignStatusId: Yup.number().required('Status is required'),
    linkImg: Yup.mixed().required('Image is required'),
  })
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      campaignStatusId: -1,
      linkImg: null,
    },
    validationSchema: CreateCampaignSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const data = new FormData()
      data.append('name', values.name)
      data.append('description', values.description)
      data.append('campaignStatusId', +values.campaignStatusId)
      if (imgData) data.append('linkImg', values.linkImg)
      await fetchCreateCampaign(data)
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
    <Dialog open={open} onClose={handleClose}>
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

            <Select
              sx={{ mt: 1 }}
              labelId='campaignStatusId'
              id='campaignStatusId'
              value={
                campaignStatus?.find(({ id }) => id === values.campaignStatusId)
                  ?.status
              }
              label='Status'
              fullWidth
              onChange={(e) => {
                if (e.target.value) {
                  const object = campaignStatus.find(
                    ({ status }) => status === e.target.value
                  )
                  setFieldValue('campaignStatusId', object?.id)
                }
              }}
            >
              {campaignStatus?.map(({ status }) => (
                <MenuItem value={status} key={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ margin: '15px auto' }}>
              {' '}
              <Button variant='contained' sx={{ cursor: 'pointer' }}>
                Image
                <Input
                  error={Boolean(errors.linkImg && touched.linkImg)}
                  name='image'
                  sx={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                  type='file'
                  onChange={(e) => {
                    if (e.target.files) {
                      setFieldValue('linkImg', e.target.files[0])
                      const reader = new FileReader()
                      reader.addEventListener('load', () => {
                        setImgData(reader.result)
                      })
                      reader.readAsDataURL(e.target.files[0])
                    }
                  }}
                />
              </Button>
            </Box>

            {touched.linkImg && (
              <FormHelperText error>{errors.linkImg}</FormHelperText>
            )}

            {imgData && (
              <img
                style={{ width: 'auto', height: 250 }}
                src={imgData}
                alt='ảnh nền'
              />
            )}
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
AddCampaignModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeCampaignList: PropTypes.func,
}
