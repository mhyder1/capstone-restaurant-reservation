import React, { useState } from "react";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationInfo from "../reservations/ReservationInfo";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);

  //captures mobile number when entered in form
  const handleChange = ({ target }) => {
    setMobile(target.value);
    console.log(mobile)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { signal, abort } = new AbortController();

    setError(null);

    listReservations({ mobile_number: mobile }, signal)
      .then(setReservations)
      .catch(setError);

    return () => abort();
  };

  return (
    <div>
      <h3>Search</h3>
      <ErrorAlert error={error}/>
      <form onSubmit={handleSubmit}>
        <label>Seach by phone number:</label>
        <input
          name="mobile_number"
          id="mobile_number"
          placeholder="Enter a customer's phone number"
          
          onChange={handleChange}
          value={mobile}
        />
        <button type="submit">Find</button>
      </form>

      <table>
          <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Date</th>
                <th>Time</th>
                <th># of Guests</th>
                <th>Status</th>
                <th>Seat</th>
                <th>Edit</th>
                <th>Cancel</th>
              </tr>
          </thead>
          <tbody>
              {reservations.length > 0 ? (reservations.map((reservation) => (
                 <ReservationInfo key={reservation.reservation_id}reservation={reservation}/>
              ))): (
              <tr>
                <td>No reservations found.</td>
              </tr>
              )}
          </tbody>
      </table>
    </div>
  );
}

export default Search;
