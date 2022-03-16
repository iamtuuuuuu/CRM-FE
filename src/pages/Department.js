import { filter } from 'lodash'
import { sentenceCase } from 'change-case'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack'
// import editFill from '@iconify/icons-eva/edit-fill';

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
  IconButton
} from '@mui/material'
// components
import Page from '../components/Page'
import Label from '../components/Label'
import Scrollbar from '../components/Scrollbar'
import Iconify from '../components/Iconify'
import SearchNotFound from '../components/SearchNotFound'
import DepartmentListHead from 'src/sections/@dashboard/department/DepartmentListHead'
import DepartmentListToolbar from 'src/sections/@dashboard/department/DepartmentListToolbar'
import AddDepartmentModal from 'src/sections/@dashboard/department/AddDepartmentModal';
import EditDepartmentModal from 'src/sections/@dashboard/department/EditDepartmentModal';

import departmentApi from 'src/apis/department.api'
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'numberEmployee', label: 'Number of employees', alignRight: false },
  { id: 'action', label: 'Action', alignRight: true },
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
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [department, setDepartment] = useState([])
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [idSelected, setIdSelected] = useState(-1);


  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await departmentApi.getAll()
        setDepartment(res)
      } catch (e) {
        enqueueSnackbar(`${e.error}: ${e.message}`, {
          variant: 'error',
        })
      }
    }
    fetchDepartment()
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = department.map((n) => n.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    console.log(id)
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
  }

  const handleOpenEditForm = (index) => {
    setIsEditFormOpen(true);
    setIdSelected(index);
  };
  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

   const handleOpenAddForm = () => {
    setIsAddFormOpen(true);
  };
  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
  };

  const handleChangeDepartmentList = (departmentList) => {
    setDepartment(departmentList);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - department.length) : 0

  const filteredUsers = applySortFilter(
    department,
    getComparator(order, orderBy),
    filterName
  )

  const isUserNotFound = filteredUsers.length === 0

  return (
    <Page title='Department'>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Department
          </Typography>
          <Button
            variant='contained'
            onClick={handleOpenAddForm}
            startIcon={<Iconify icon='eva:plus-fill' />}
          >
            New Department
          </Button>
        </Stack>

        <Card>
          <DepartmentListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selectedList={selected}
            handleChangeDepartmentList={handleChangeDepartmentList}
            setSelected={setSelected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DepartmentListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={department?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { id, name, numberEmployee } = row
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
                          <TableCell align='left'>{name}</TableCell>
                          <TableCell align='left'>{numberEmployee}</TableCell>

                          <TableCell align='right'>
                            <IconButton onClick={() => handleOpenEditForm(index)}>
                              <Iconify icon='eva:edit-fill' width={24} height={24} />
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
            count={department.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <AddDepartmentModal
          open={isAddFormOpen}
          handleClose={handleCloseAddForm}
          handleChangeDepartmentList={handleChangeDepartmentList}
        />
        <EditDepartmentModal 
          open={isEditFormOpen}
          handleClose={handleCloseEditForm}
          handleChangeDepartmentList={handleChangeDepartmentList}
          department={filteredUsers?.[idSelected]}
        />
      </Container>
    </Page>
  )
}
