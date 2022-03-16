import { filter } from 'lodash'
import { sentenceCase } from 'change-case'
import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Link,
} from '@mui/material'
// components
import Page from '../components/Page'
import Label from '../components/Label'
import Scrollbar from '../components/Scrollbar'
import Iconify from '../components/Iconify'
import SearchNotFound from '../components/SearchNotFound'
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user'
//
import employeeApi from 'src/apis/employee.api'
import { useSnackbar } from 'notistack'
import EditUserModal from 'src/sections/@dashboard/user/EditUserModal'
import { customerApi } from 'src/apis/customer.api'
import AddCustomerModal from 'src/sections/@dashboard/customer/AddCustomerModal'
import EditCustomerModal from 'src/sections/@dashboard/customer/EditCustomnerModal'
import { fData } from 'src/utils/formatNumber'
import { fDate } from 'src/utils/formatTime'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phoneNumber', label: 'Phone', alignRight: false },
  { id: 'gender', label: 'Gender', alignRight: false },
  { id: 'dob', label: 'Birthday', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'ref', label: 'Referent', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'edit', label: 'Edit', alignRight: true },
]

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    )
  }
  return stabilizedThis.map((el) => el[0])
}

export default function Customer() {
  const { enqueueSnackbar } = useSnackbar()

  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [selected, setSelected] = useState([])
  const [orderBy, setOrderBy] = useState('name')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [customers, setCustomers] = useState([])
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [idSelected, setIdSelected] = useState(-1)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await customerApi.getAll()
        setCustomers(res)
      } catch (e) {
        enqueueSnackbar(`${e.error}: ${e.message}`, {
          variant: 'error',
        })
      }
    }
    fetchCustomer()
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = customers.map((n) => n.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)

    // const filterList = users.filter((user) => user.name.include(filterName))
    // setUsers(filterList)
  }

  const handleOpenEditForm = (index) => {
    setIsEditFormOpen(true)
    setIdSelected(index)
  }
  const handleCloseEditForm = () => {
    setIsEditFormOpen(false)
  }
  const handleAddFormOpen = () => {
    setIsAddFormOpen(true)
  }
  const handleAddFormClose = () => {
    setIsAddFormOpen(false)
  }

  const handleChangeCustomerList = (customersList) => {
    setCustomers(customersList)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customers.length) : 0

  const filteredUsers = applySortFilter(
    customers,
    getComparator(order, orderBy),
    filterName
  )

  const isUserNotFound = filteredUsers.length === 0

  return (
    <Page title='User | Minimal-UI'>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Customers
          </Typography>
          <Button
            onClick={handleAddFormOpen}
            variant='contained'
            component={RouterLink}
            to='#'
            startIcon={<Iconify icon='eva:plus-fill' />}
          >
            Add Customer
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={customers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        id,
                        name,
                        email,
                        status,
                        phoneNumber,
                        gender,
                        address,
                        ref,
                        dob,
                      } = row
                      const isItemSelected = selected.indexOf(id) !== -1

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role='checkbox'
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell align='left'>{id}</TableCell>
                          <TableCell align='left'>
                            <Link
                              to={`/dashboard/customers/${id}`}
                              color='inherit'
                              underline='hover'
                              component={RouterLink}
                            >
                              <Typography variant='subtitle2' noWrap>
                                {name}
                              </Typography>
                            </Link>
                          </TableCell>
                          <TableCell align='left'>
                            <Link
                              to={`/dashboard/customers/${id}`}
                              color='inherit'
                              underline='hover'
                              component={RouterLink}
                            >
                              <Typography variant='subtitle2' noWrap>
                                {email}
                              </Typography>
                            </Link>
                          </TableCell>
                          <TableCell align='left'>{phoneNumber}</TableCell>
                          <TableCell align='left'>{gender}</TableCell>
                          <TableCell align='left'>{fDate(dob)}</TableCell>
                          <TableCell align='left'>{address}</TableCell>
                          <TableCell align='left'>{ref}</TableCell>
                          <TableCell align='left'>
                            <Label
                              variant='ghost'
                              color={(status === 'ban' && 'error') || 'success'}
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>
                          <TableCell align='right'>
                            <IconButton
                              onClick={() => handleOpenEditForm(index)}
                            >
                              <Iconify
                                icon='eva:edit-fill'
                                width={24}
                                height={24}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align='center' colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <AddCustomerModal
          open={isAddFormOpen}
          handleClose={handleAddFormClose}
          handleChangeCustomerList={handleChangeCustomerList}
        />
        <EditCustomerModal
          open={isEditFormOpen}
          handleClose={handleCloseEditForm}
          handleChangeCustomerList={handleChangeCustomerList}
          customer={filteredUsers?.[idSelected]}
        />
        {/* <EditUserModal
          open={isEditFormOpen}
          handleClose={handleCloseEditForm}
          handleChangeUserList={handleChangeUserList}
          user={filteredUsers?.[idSelected]}
        /> */}
      </Container>
    </Page>
  )
}
