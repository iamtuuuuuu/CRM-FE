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
import taskApi from 'src/apis/task.api'
import TaskListToolbar from 'src/sections/@dashboard/tasks/TaskListToolbar'
import TaskListHead from 'src/sections/@dashboard/tasks/TaskListHead'
import EditTaskModal from 'src/sections/@dashboard/tasks/EditTaskModal'
import AddTaskModal from 'src/sections/@dashboard/tasks/AddTaskModal'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'createdAt', label: 'Created at', alignRight: false },
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

export default function Task() {
  const { enqueueSnackbar } = useSnackbar()

  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [selected, setSelected] = useState([])
  const [orderBy, setOrderBy] = useState('name')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tasks, setTasks] = useState([])
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const [idSelected, setIdSelected] = useState(-1)

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((n) => n.id)
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

  const handleOpenAddForm = () => {
    setIsAddFormOpen(true)
  }
  const handleCloseAddForm = () => {
    setIsAddFormOpen(false)
  }

  const handleChangeTasksList = (tasksList) => {
    setTasks(tasksList)
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0

  const filteredTasks = applySortFilter(
    tasks,
    getComparator(order, orderBy),
    filterName
  )

  const isTaskNotFound = filteredTasks.length === 0

  return (
    <Page title='Task | CRM'>
      <Container>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          mb={5}
        >
          <Typography variant='h4' gutterBottom>
            Tasks
          </Typography>
          <Button
            onClick={handleOpenAddForm}
            variant='contained'
            component={RouterLink}
            to='#'
            startIcon={<Iconify icon='eva:plus-fill' />}
          >
            New Task
          </Button>
        </Stack>

        <Card>
          <TaskListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selectedList={selected}
            handleChangeTasksList={handleChangeTasksList}
            setSelected={setSelected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TaskListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tasks?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredTasks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { id, name, description, createdAt } = row
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
                          <TableCell align='left'>{description}</TableCell>
                          <TableCell align='left'>{createdAt}</TableCell>

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
                {isTaskNotFound && (
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
            count={tasks?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <AddTaskModal
          open={isAddFormOpen}
          handleClose={handleCloseAddForm}
          handleChangeTaskList={handleChangeTasksList}
        />
        <EditTaskModal
          open={isEditFormOpen}
          handleClose={handleCloseEditForm}
          handleChangeTaskList={handleChangeTasksList}
          task={filteredTasks?.[idSelected]}
        />
      </Container>
    </Page>
  )
}
