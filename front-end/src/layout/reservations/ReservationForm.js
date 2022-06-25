import React from "react";
import { useHistory } from "react-router";


function ReservationForm({ formInitialState, handleSubmit, handleFormChange }) {

  const history = useHistory();
  
  const handleCancel = () =>{
    history.goBack();
  }

  
    return (
      formInitialState && (

        <div>
            
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label>First Name:</label>
                <input 
                type="text"
                name="first_name"
                placeholder={formInitialState?.first_name || "First Name"}
              value={formInitialState?.first_name}
                onChange={handleFormChange}
                required
                 />
              </div>
              <div>
                <label>Last Name:</label>
                <input 
                type="text"
                name="last_name"
                placeholder={formInitialState?.Last_name || "Last Name"}
                value={formInitialState?.last_name}
                onChange={handleFormChange}
                required
                 />
              </div>
              <div>
                <label>Mobile Number:</label>
                <input 
                type="tel"
                name="mobile_number"
                value={formInitialState?.mobile_number}
                onChange={handleFormChange}
                required
                 />
              </div>
              <div>
                <label>Reservation Date:</label>
                <input 
                type="date"
                name="reservation_date"
                value={formInitialState?.reservation_date}
                onChange={handleFormChange}
                required
                 />
              </div>
              <div>
                <label>Reservation Time:</label>
                <input 
                type="time"
                name="reservation_time"
                value={formInitialState?.reservation_time}
                onChange={handleFormChange}
                required
                 />
              </div>
              <div>
                <label>Number of Guests</label>
                <input 
                type="number"
                name="people"
                value={formInitialState?.people}
                onChange={handleFormChange}
                required />
              </div>
              <button
              type="submit"
              >Submit</button>
              <button
              onClick={handleCancel}
              >Cancel</button>
            </form>
          </div>
        </div>
      )
      );
}

export default ReservationForm;
