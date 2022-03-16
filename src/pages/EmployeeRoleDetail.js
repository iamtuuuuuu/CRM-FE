import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Checkbox,
} from '@mui/material'
// components
import Label from '../components/Label'

import Page from '../components/Page'
import Scrollbar from '../components/Scrollbar'
import SearchNotFound from '../components/SearchNotFound'
import CategoryListHead from '../components/_dashboard/category/CategoryListHead'
import RoleListToolbar from '../components/_dashboard/role/RoleListToolbar'
//
import userApi from '../api/userApi'
import spinner from '../assets/loading.svg'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'authorized', label: 'Authorized', alignRight: false },
]

// ----------------------------------------------------------------------

export default function Roles() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [orderBy, setOrderBy] = useState('name')
  const [order, setOrder] = useState('asc')
  const [selected, setSelected] = useState([])
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [roleList, setRoleList] = useState([])
  const [userRoleList, setUserRoleList] = useState([])

  const handleChangeUserRoles = (roles) => {
    setUserRoleList(roles)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const authorizedRole = userRoleList.map((item) => item.id)

      const newSelecteds = roleList
        .filter((item) => !authorizedRole.includes(item.id))
        ?.map((n) => n.id)
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
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roleList?.length) : 0

  const isUserNotFound = roleList.length === 0
  React.useEffect(() => {
    const fetchRoleList = async () => {
      setIsLoading(true)
      try {
        const res = await userApi.getAllRoles()
        setRoleList(res.data)
        setIsLoading(false)
      } catch (e) {
        console.log('Error : ', e)
      }
    }
    fetchRoleList()
  }, [])
  React.useEffect(() => {
    const fetchRoleListOfUser = async () => {
      try {
        const res = await userApi.getRolesForUser(id)
        setUserRoleList(res.data)
      } catch (e) {
        console.log('Error', e)
      }
    }
    fetchRoleListOfUser()
  }, [id])
  console.log('Selected ', selected)
  return (
    <Page title='User Detail '>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={spinner} style={{ height: '300px' }} alt='loading gif' />
        </div>
      ) : (
        <Container>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            mb={5}
          >
            <Typography variant='h4' gutterBottom>
              Roles
            </Typography>
          </Stack>
          <Card>
            <RoleListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              selectedList={selected}
              handleChangeRoleList={handleChangeUserRoles}
              userId={id}
              setSelected={setSelected}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <CategoryListHead
                    headLabel={TABLE_HEAD}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={roleList?.length - userRoleList?.length}
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {roleList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const { id, name, code } = row
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
                            <TableCell component='th' scope='row'>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={2}
                              >
                                <Typography variant='subtitle2' noWrap>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align='left'>{code}</TableCell>
                            <TableCell align='left'>
                              <Label
                                variant='ghost'
                                color={
                                  (userRoleList.filter(
                                    (category) => category.id === id
                                  ).length > 0 &&
                                    'success') ||
                                  'error'
                                }
                              >
                                {userRoleList.filter(
                                  (category) => category.id === id
                                ).length > 0
                                  ? 'authorized'
                                  : 'denied'}
                              </Label>
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
              count={roleList?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}
    </Page>
  )
}
