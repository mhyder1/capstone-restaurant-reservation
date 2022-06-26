import React, { useState } from "react";
import { unassignTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableList({ table, loadDashboard, error, date }) {
  async function handleClick() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishHandler();
    }
  }

  async function finishHandler() {
    const { signal } = new AbortController();
    await unassignTable(table.table_id, signal);
    loadDashboard();
  }

  return (
    <div>
      <h5>Name: {table.table_name}</h5>
      <h6>Capacity: {table.capacity}</h6>
      <p data-table-id-status={table.table_id}>
        {table.reservation_id ? "occupied" : "free"}
      </p>
      {table.reservation_id && (
        <button
          data-table-id-finish={table.table_id}
          onClick={handleClick}
          type="button"
        >
          Finish
        </button>
      )}
      <hr />
    </div>
  );
}

export default TableList;
