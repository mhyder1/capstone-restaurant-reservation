import React, { useState } from "react";

function ReservationForm() {
  const formInitialState = {
      first_name:"",
      last_name:"",
      mobile_number:"",
      reservation_date:"",
      reservation_time:"",
      people:"",
  }

  const [form, setForm] = useState({...formInitialState})

  const handleFormChange = (e) => {
      setForm({
          ...form,
          [e.target.name]: e.target.value,
      })
      console.log(form)
  }
  
    return (
    <div>
      <div>
        <form>
          <div>
            <label>First Name:</label>
            <input 
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleFormChange}
            required
             />
          </div>
          <div>
            <label>Last Name:</label>
            <input 
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleFormChange}
            required
             />
          </div>
          <div>
            <label>Mobile Number:</label>
            <input 
            type="tel"
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleFormChange}
            required
             />
          </div>
          <div>
            <label>Reservation Date:</label>
            <input 
            type="date"
            name="reservation_date"
            value={formInitialState.reservation_date}
            onChange={handleFormChange}
            required
             />
          </div>
          <div>
            <label>Reservation Time:</label>
            <input 
            type="time"
            name="reservation_time"
            value={form.reservation_time}
            onChange={handleFormChange}
            required
             />
          </div>
          <div>
            <label>Number of Guests</label>
            <input 
            type="number"
            name="people"
            value={form.people}
            onChange={handleFormChange}
            required />
          </div>
          <button>Submit</button>
          <button>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default ReservationForm;
