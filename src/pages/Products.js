import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
// material
import { Container, Stack, Typography, Button } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Iconify from '../components/Iconify'

// components
import Page from '../components/Page'
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar,
} from '../sections/@dashboard/products'
//
import PRODUCTS from '../_mocks_/products'
import { useSnackbar } from 'notistack'
import productApi from 'src/apis/product.api'
import AddProductModal from 'src/sections/@dashboard/products/AddProductModal'

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const { enqueueSnackbar } = useSnackbar()
  const [openFilter, setOpenFilter] = useState(false)
  const [products, setProducts] = useState([])
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAllProduct()
        setProducts(res)
      } catch (e) {
        enqueueSnackbar(`${e.error}: ${e.message}`, {
          variant: 'error',
        })
      }
    }

    fetchProducts()
  }, [])

  const handleOpenAddForm = () => {
    setIsAddFormOpen(true)
  }
  const handleCloseAddForm = () => {
    setIsAddFormOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: '',
    },
    onSubmit: () => {
      setOpenFilter(false)
    },
  })

  const { resetForm, handleSubmit } = formik
  const handleChangeProducts = (products) => {
    setProducts(products)
  }
  const handleOpenFilter = () => {
    setOpenFilter(true)
  }

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

  const handleResetFilter = () => {
    handleSubmit()
    resetForm()
  }

  return (
    <Page title='Dashboard: Products | Minimal-UI'>
      <Container>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack
          direction='row'
          flexWrap='wrap-reverse'
          alignItems='center'
          justifyContent='flex-end'
          sx={{ mb: 5 }}
        >
          <Stack direction='row' spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <Button
              onClick={handleOpenAddForm}
              variant='contained'
              component={RouterLink}
              to='#'
              startIcon={<Iconify icon='eva:plus-fill' />}
            >
              Add New Product
            </Button>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={products} />
        {/* <ProductCartWidget /> */}
      </Container>
      <AddProductModal
        open={isAddFormOpen}
        handleClose={handleCloseAddForm}
        handleChangeProducts={handleChangeProducts}
      />
    </Page>
  )
}
