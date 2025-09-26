// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Row,
  CardDeck
} from "reactstrap"
import Select from "react-select"
import { useEffect, useState } from "react"
import EventService from "@services/EventService"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { getStatus } from "../utility/Utils"
import { Download, Mail } from "react-feather"
import SpinnerComponent from "../@core/components/spinner/Fallback-spinner"

const Invitations = () => {
  const [events, setEvents] = useState([])
  const [invData, setInvData] = useState([])
  const [pending, setPending] = useState(true)
  const [invitationOpt, setInvitationOpt] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setPending(true)
    setProgress(0)
    EventService.getAllEvents()
      .then((res) => {
        const eventObjs = res.data.data
        eventObjs.map((event) => {
          const eventObj = {
            value: event.id,
            label: event.name
          }

          setProgress(25)
          if (event.invitation_feature) {
            setInvitationOpt(true)
          }

          setEvents((events) => [...events, eventObj])
        })

        EventService.getInvitations(res.data.data[0].id)
          .then((res) => {
            setInvData(res.data.data.invitations)
            setEvent(res.data.data.event)
            setPending(false)
            setProgress(75)
          })
          .catch((err) => {
            console.log(err)
            setPending(false)
          })
      })
      .catch((err) => {
        console.log(err)
        setPending(false)
      })
  }, [])

  const columns = [
    {
      name: "Event Name",
      minWidth: "225px",
      sortable: true,
      selector: (row) => row.event.name
    },
    {
      name: "Invitation ID",
      minWidth: "225px",
      selector: (row) => row.invitation_id
    },
    {
      name: "Cust. Name",
      selector: (row) => row.user.name
    },
    {
      name: "Cust. Email",
      minWidth: "225px",
      selector: (row) => row.user.email
    },
    {
      name: "Tickets",
      selector: (row) => row.tickets_count
    },
    {
      name: "Status",
      selector: (row) => getStatus(row.status)
    }
  ]

  const handleEventChange = (e) => {
    setPending(true)
    const value = e.value

    EventService.getInvitations(value)
      .then((res) => {
        setInvData(res.data.data.invitations)
        setEvent(res.data.data.event)
        setPending(false)
      })
      .catch((err) => {
        console.log(err)
        setPending(false)
      })
  }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = Object.keys(array[0]).filter(
      (key) =>        key !== "user_id" &&
        key !== "event_id" &&
        key !== "id" &&
        key !== "created_at" &&
        key !== "updated_at"
    )

    keys.push("user_email")

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter

        // Check if the current key is 'manager.name', if so, extract the nested value
        if (key === "user") {
          result += item.user.name || "" // Use empty string if manager.name is null or undefined
        } else if (key === "event") {
          result += item.event.name || ""
        } else if (key === "invitation_id") {
          result += item.invitation_id || ""
        } else if (key === "status") {
          result += item.status || ""
        } else if (key === "status") {
          result += item.status || ""
        } else if (key === "tickets_count") {
          result += item.tickets_count || ""
        } else if (key === "user_email") {
          result += item.user.email || ""
        }

        ctr++
      })
      result += lineDelimiter
    })

    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a")
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = "export.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  return (
    <Card>
    {
      invitationOpt && !pending ? <>
      <CardHeader className="border-bottom">
        <Col lg="6" md="6" className="mb-1">
          <Select
            className="react-select"
            classNamePrefix="select"
            options={events}
            isClearable={false}
            defaultValue={events[0]}
            onChange={handleEventChange}
            isLoading={pending}
          />
        </Col>

        <div className="d-flex mt-md-0 mt-1">
          <Col lg="12" md="12" className="mb-1">
            <Button
              className="ms-2"
              color="primary"
              onClick={() => downloadCSV(invData)}
            >
              <Download size={15} />
              <span className="align-middle ms-50">Download CSV</span>
            </Button>
            <Link to={"/send-invitations"}>
              <Button color="success" className="ms-2">
                <Mail size={15} />
                <span className="align-middle ms-50">Send Invitations</span>
              </Button>
            </Link>
          </Col>
        </div>
      </CardHeader>
      <CardBody>
        <div className="react-dataTable">
          <DataTable
            columns={columns}
            data={invData}
            pagination
            progressPending={pending}
            progressComponent={<SpinnerComponent />}
          />
        </div>
      </CardBody>
      </> : pending ? <SpinnerComponent progress={progress}/> : <code>Contact Spotseeker.lk for assistance</code>
    }
      
    </Card>
  )
}
export default Invitations
