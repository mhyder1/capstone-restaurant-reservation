import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function Tables() {
  const history = useHistory();
  const formInitialState = {
    table_name: "",
    capacity: 0,
  };
  const [tableForm, setTableForm] = useState({ ...formInitialState });
  const [tableError, setTableError] = useState(null);



  const handleFormChange = (e) => {
    setTableForm({
      ...tableForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = async (event) => {
    const { signal, abort } = new AbortController();
    event.preventDefault();
    try {
      tableForm.capacity = Number(tableForm.capacity);
      await createTable(tableForm, signal);
      history.push("/dashboard");
    } catch (error) {
      setTableError(error);
    }
    return () => abort();
  };

  return (
    <div>
      <h1>Tables</h1>
      <div>
        <ErrorAlert error={tableError} />
        <form onSubmit={handleSubmit}>
          <div>
            <label>Table Name:</label>
            <input
              type="text"
              name="table_name"
              value={tableForm.table_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label>Table Capacity:</label>
            <input
              type="number"
              name="capacity"
              value={tableForm.capacity}
              onChange={handleFormChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
          <button onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default Tables;
