// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Download, MoreVertical, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardBody, CardTitle, DropdownMenu, DropdownToggle, UncontrolledDropdown, Button, Badge, DropdownItem } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

import EventService from '../../../../services/EventService'
import { Alert } from '../../../../utility/alerts'
import { getStatus } from '../../../../utility/Utils'


const DataTableAdvSearch = () => {
  // ** States
  const [pending, setPending] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState([])

  const advSearchColumns = [
    {
      name: 'Event',
      sortable: true,
      compact: true,
      wrap: true,
      width: "190px",
      selector: row => row.name
    },
    {
      name: 'Organizer',
      sortable: true,
      wrap: true,
      selector: row => row.organizer
    },
    {
      name: 'Start Date',
      sortable: true,
      wrap: true,
      selector: row => row.start_date
    },
    {
      name: 'Venue',
      sortable: true,
      wrap: true,
      width: '250px',
      selector: row => row.venue.name
    },
    {
      name: 'Featured',
      sortable: true,
      selector: row => {
        let color = ''
        let text = ''
        if (row.featured) {
          color = 'success'
          text = 'Yes'
        } else {
          color = 'danger'
          text = 'No'
        }
        return (
          <Badge color={color} className='badge-glow'>
            {text}
          </Badge>
        )
      }
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => {
        return getStatus(row.status)
      }
    },
    {
      name: 'Actions',
      allowOverflow: true,
      width: "100px",
      fixed: true,
      cell: (row) => {
        return (
          <div className='d-flex' >
            <UncontrolledDropdown direction="start">
              <DropdownToggle className='pe-1' tag='span'>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu container="body">
                <DropdownItem tag='button' className='w-100' href={`/events/edit/${row.id}`} >
                  <Edit size={15} />
                  <span className='align-middle ms-50'>Edit</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    setPending(true)
    setData([])

    EventService.getAllEvents(null, null, null)
    .then(res => {
      setData(res.data.data)
      setPending(false)
    })
    .catch(err => {
      console.log(err)
      setPending(false)
    })
  }, [])

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)

  // ** Table data to render
  const dataToRender = () => {
    return data
  }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    
    const keys = Object.keys(array[0]).filter(
        key => key !== 'description' && key !== 'ticket_packages' && key !== 'promo'
    )

    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
        let ctr = 0
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter

            // Check if the current key is 'manager.name', if so, extract the nested value
            if (key === 'manager') {
                result += item.manager.name || '' // Use empty string if manager.name is null or undefined
            } else if (key === 'venue') {
              result += item.venue.name || ''
            } else {
                result += item[key]
            }

            ctr++
        })
        result += lineDelimiter
    })

    return result
}

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={Math.ceil(dataToRender().length / 7) || 1}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'}
    />
  )

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Events List</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => downloadCSV(data)}>
              <Download size={15} />
              <span className='align-middle ms-50'>Download CSV</span>
            </Button>
          </div>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={advSearchColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            defaultSortFieldId={0}
            defaultSortAsc={false}
            progressPending={pending}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableAdvSearch
