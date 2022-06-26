import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
//import { useHistory} from "react-router";
import { previous, next, today } from "../utils/date-time";
import { Link } from "react-router-dom";
import TableList from "./TableList";
import ReservationInfo from "../layout/reservations/ReservationInfo";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  //const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [resError, setResError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setResError(null);
    setTablesError(null);
    setReservations([]);

    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(console.log);

    listTables(abortController.signal)
      .then((tables) =>
        tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id)
      )
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        {!reservations.length ? (
          <p>No Reservations</p>
        ) : (
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
              {reservations.map((reservation, index) => (
                <ReservationInfo
                  reservation={reservation}
                  loadDashboard={loadDashboard}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <Link to={`/dashboard?date=${previous(date)}`}>
          <button>Previous</button>
        </Link>
        <Link to={`/dashboard?date=${today()}`}>
          <button>Today</button>
        </Link>
        <Link to={`/dashboard?date=${next(date)}`}>
          <button>Next</button>
        </Link>
      </div>

      <div>
        <h4 className="mb-0">Table List</h4>
        {tables.map((table, index) => (
          <TableList
            key={table.table_id}
            table={table}
            error={tablesError}
            loadDashboard={loadDashboard}
            date={date}
          />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
