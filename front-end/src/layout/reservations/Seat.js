import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../ErrorAlert";
import { listTables, seatReservation} from "../../utils/api";

function Seat() {
 

  const { reservation_id } = useParams();
  const history = useHistory();

  
  const [tables, setTables] = useState([]);
  const [seatTable, setSeatTable] = useState(null);
  const [error, setError] = useState([null]);
 

  //load tables
  useEffect(() => {
    const abortController = new AbortController();

    async function loadData() {
      try {
        setError(null);
       
        const tablesResponse = await listTables(abortController.signal);
        const freeTables = tablesResponse.filter((table) => {
          return table.status === "free";
        });
       // setReservation(reservationResponse);
        setTables(freeTables);
      } catch (error) {
        setError(error);
      }
    }
    loadData();
    return () => abortController.abort();
  }, [reservation_id]);

  const handleCancel = () => {
    history.goBack();
  };

  const handleSelect = (e) => {
      setSeatTable(e.target.value)
      console.log(seatTable)
  }

//   const handleSelect = ({ target }) => {
//       //setError(null)
//     const tableSelected = tables.find(
//       (table) => table.table_id === parseInt(target.value)
//     );
//     console.log(tableSelected)
//     console.log(reservation.reservation_id)
//     if (tableSelected && tableSelected.capacity < reservation.people) {
//       setError(["Table capacity will not accomadate reservation size"]);
//     } else if (!tableSelected) {
//       setError(["Please select a table."]);
//     } else {
//       setError([null]);
//     }
//     setSeatTable({
//       ...seatTable,
//       [target.name]: parseInt(target.value),
//     });
//     console.log(seatTable)
//   };

  // e.preventDefault();
  // const abortController = new AbortController();
  // //put request
  // setSeatTable(e.target.value);
  // console.log(seatTable)

  
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const abortController = new AbortController();
//     // PUT request
//     async function seating() {
//         try {
//             await seatReservation(seatTable, reservation_id, abortController.signal);
//             history.push("/dashboard");
//         } catch (error) {
//             setError([...error, error.message]);
//         }
//     }
//     // do not send PUT request if there is a pending error message
//     if (error.length === 0) {
//         seating();
//     }
// }
  
  async function handleSubmit(e) {
    e.preventDefault();
    const { signal, abort } = new AbortController();
    try {
        //console.log(seatTable)
      const seatResponse = await seatReservation(
        seatTable,
        reservation_id,
        signal
      );
      if (seatResponse) {
        //console.log(seatResponse)
        history.push("/dashboard");
      }
    } catch (error) {
      setError(error);
    }
    return () => abort();
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <div>
        <h3>Select Table for Reaservation Seating</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Seat at Table Number:
              <select
                id="table_id"
                name="table_id"
                onChange={handleSelect}
                required
              >
                <option defaultValue> Select a Table</option>
                {tables.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit">Submit</button>
          <button onClick={handleCancel}>Cancel</button>
        </form>
        {seatTable}
      </div>
    </div>
  );
}

export default Seat;
