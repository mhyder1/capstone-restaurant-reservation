import React from 'react'
import { cancelReservation } from '../../utils/api'
//import { useHistory } from 'react-router'



function ReservationInfo({ reservation, loadDashboard, displayTables }) {
// const history = useHistory()




const handleCancel = (e) => {
  return window.confirm(
    "Do you want to cancel this reservation? This cannot be undone."
  )
    ? cancelReservation(reservation.reservation_id)
      .then(loadDashboard)
      //.then(history.go(0))
    : null
}

  return (
    <>
        <tr key={reservation.reservation_id}>
        <td>{reservation.reservation_id} </td>
                  <td>{reservation.first_name} </td>
                  <td>{reservation.last_name} </td>
                  <td>{reservation.mobile_number}</td>
                  <td>{reservation.reservation_date}</td>
                  <td>{reservation.reservation_time}</td>
                  <td>{reservation.people}</td>
                  <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                  <td>
                    {reservation.status === "booked" && (
                    <a href={`/reservations/${reservation.reservation_id}/seat` }role="button">Seat</a>
                    )}
                  </td>
                  <td>
                  <a href={`/reservations/${reservation.reservation_id}/edit` }role="button">Edit</a>
                  </td>
                  <td>
                    <button 
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
    </>
  )
}

export default ReservationInfo