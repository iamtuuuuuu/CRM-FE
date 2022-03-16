import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
// material
import { Box, Card, Link, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
// utils
import { fCurrency } from '../../../utils/formatNumber'
//
import Label from '../../../components/Label'
import ColorPreview from '../../../components/ColorPreview'

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
})

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
}

export default function ShopProductCard({ product }) {
  const { id, name, linkImg } = product

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <ProductImgStyle alt={name} src={linkImg} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          to={`/dashboard/products/${id}`}
          color='inherit'
          underline='hover'
          component={RouterLink}
        >
          <Typography variant='subtitle2' noWrap>
            {name.toUpperCase()}
          </Typography>
        </Link>
      </Stack>
    </Card>
  )
}
