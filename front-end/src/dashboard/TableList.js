import React, { useState } from "react";
import { unassignTable } from "../utils/api";
import { useHistory } from "react-router";
//import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

function TableList({ table, loadDashboard, error, date }) {
  //const [error, setError] = useState(null);
  

  const history = useHistory();



async function handleClick(){
   if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
        finishHandler();
      }
}

async function finishHandler(){
  const { signal } = new AbortController();
  await  unassignTable(table.table_id, signal)
  loadDashboard()
    // history.push("/dashboard")
}



   
  

  

  return (
    <div>
        <ErrorAlert error={error}/>
      <h5>Name:{table.table_name}</h5>
      <h6>Capacity:{table.capacity}</h6>
      <p data-table-id-status={table.table_id}>{table.status}</p>
      {table.status === "free" ? null : (
        <button
         data-table-id-finish={table.table_id}
         onClick={handleClick} 
         type='button'>
          Finish
        </button>
      )}
    </div>
  );
}

export default TableList;
