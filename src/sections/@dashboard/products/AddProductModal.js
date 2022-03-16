import {
  Button,
  FormHelperText,
  Modal,
  Paper,
  TextField,
  Typography,
  Box,
  Input,
  DialogActions,
} from '@mui/material'
import PropTypes from 'prop-types'
import { LoadingButton } from '@mui/lab'

import { Field, Formik } from 'formik'
import * as Yup from 'yup'
import React, { useState } from 'react'
import productApi from 'src/apis/product.api'
import { useSnackbar } from 'notistack'

const AddProductModal = ({ open, handleClose, handleChangeProducts }) => {
  const [imgData, setImgData] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const initialValues = {
    name: '',
    description: '',
    linkImg: null,
  }
  return (
    <Modal
      open={open}
      onClose={() => {
        setImgData(null)
        handleClose()
      }}
      sx={{
        width: 700,
        margin: '0px auto',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Paper elevation={5}>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
            description: Yup.string().required('Description is required'),
            linkImg: Yup.mixed().required('Image is required'),
          })}
          onSubmit={async (values) => {
            const data = new FormData()
            data.append('name', values.name)
            data.append('description', values.description)
            if (imgData) data.append('linkImg', values.linkImg)

            try {
              await productApi.createProduct(data)
              const res = await productApi.getAllProduct()
              handleChangeProducts(res)
              handleClose()
            } catch (e) {
              if (e.statusCode === 403) {
                enqueueSnackbar('You must be ADMIN to add new product', {
                  variant: 'error',
                })
              } else {
                enqueueSnackbar(e.message, { variant: 'error' })
              }
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
            setFieldValue,
            isSubmitting,
          }) => (
            <Box
              component='form'
              encType='multipart/form-data'
              onSubmit={handleSubmit}
              sx={{ width: 500, margin: '50px auto' }}
            >
              <Typography variant='h2' align='center' p={3}>
                Add New Product
              </Typography>

              <TextField
                sx={{ mb: 3 }}
                error={Boolean(errors.name && touched.name)}
                helperText={touched.name && errors.name}
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                name='name'
                label='Name'
              />
              <TextField
                sx={{ mb: 3 }}
                error={Boolean(errors.description && touched.description)}
                helperText={touched.description && errors.description}
                fullWidth
                multiline
                maxRows={4}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                name='description'
                label='Description'
              />

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

              <Box
                sx={{
                  padding: '30px 0 20px 0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button onClick={handleClose} sx={{ marginRight: '10px' }}>
                  Cancel
                </Button>
                <LoadingButton
                  size='medium'
                  type='submit'
                  variant='contained'
                  loading={isSubmitting}
                >
                  Confirm
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Formik>
      </Paper>
    </Modal>
  )
}
AddProductModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleChangeProducts: PropTypes.object,
}
export default AddProductModal
