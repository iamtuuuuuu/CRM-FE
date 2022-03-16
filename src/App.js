// routes
import Router from './routes'
// theme
import ThemeConfig from './theme'
import GlobalStyles from './theme/globalStyles'
// components
import ScrollToTop from './components/ScrollToTop'
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart'
import { SnackbarProvider } from 'notistack'
import { Slide } from '@mui/material'
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        TransitionComponent={Slide}
      >
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
      </SnackbarProvider>
    </ThemeConfig>
  )
}
