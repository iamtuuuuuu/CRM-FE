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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phoneNumber', label: 'Phone', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'departmentName', label: 'Department', alignRight: false },
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

export default function Employee() {
  const { enqueueSnackbar } = useSnackbar()

  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [selected, setSelected] = useState([])
  const [orderBy, setOrderBy] = useState('name')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [users, setUsers] = useState([])
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [idSelected, setIdSelected] = useState(-1)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await employeeApi.getAllEmployee()
        setUsers(res)
      } catch (e) {
        enqueueSnackbar(`${e.error}: ${e.message}`, {
          variant: 'error',
        })
      }
    }
    fetchEmployee()
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id)
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

  const handleChangeUserList = (userList) => {
    setUsers(userList)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0

  const filteredUsers = applySortFilter(
    users,
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
            Employee
          </Typography>
          <Button
            variant='contained'
            component={RouterLink}
            to='#'
            startIcon={<Iconify icon='eva:plus-fill' />}
          >
            New Employee
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
                  rowCount={users.length}
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
                        departmentName,
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
                          {/* <TableCell padding='checkbox'>
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell> */}
                          <TableCell align='left'>{id}</TableCell>
                          <TableCell align='left'>{name}</TableCell>
                          <TableCell align='left'>{email}</TableCell>
                          <TableCell align='left'>{phoneNumber}</TableCell>
                          <TableCell align='left'>
                            <Label
                              variant='ghost'
                              color={(status === 'ban' && 'error') || 'success'}
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>
                          <TableCell align='left'>{departmentName}</TableCell>
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <EditUserModal
          open={isEditFormOpen}
          handleClose={handleCloseEditForm}
          handleChangeUserList={handleChangeUserList}
          user={filteredUsers?.[idSelected]}
        />
      </Container>
    </Page>
  )
}
