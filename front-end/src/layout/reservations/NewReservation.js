import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { useHistory } from "react-router";
import ReservationForm from "./ReservationForm";
import { notOnTuesday, inTheFuture } from "../../utils/date-time";
import { createReservation } from "../../utils/api";

function NewReservation() {

  const history = useHistory();
  const formInitialState = {
      first_name:"",
      last_name:"",
      mobile_number:"",
      reservation_date:"",
      reservation_time:"",
      people:"",
  }

  const [form, setForm] = useState({...formInitialState})
  const [resError, setResError] = useState(null);

  


  const handleFormChange = (e) => {
      setForm({
          ...form,
          [e.target.name]: e.target.value,
      })
     // console.log(form)
  }

  const dateErrors = (date, errors) => {
      notOnTuesday(date, errors);
      inTheFuture(date,errors);
  }

 

  const handleSubmit = async (event)=> {
      console.log("submit")
    const { signal, abort } = new AbortController();
    event.preventDefault();
    const errors = [];
    dateErrors(form.reservation_date,errors);
    if(errors.length){
        setResError({ message: errors } );
        return;
    }
    
    try {
        form.people = Number(form.people)
         await createReservation(form, signal)
        history.push(`/dashboard?date=${form.reservation_date}`)
    } catch(error){
        setResError(error)
    }
    return ()=> abort()
  }
  

  
  return (
    <div>
      <ErrorAlert error={resError}/>
      <h1>New Reservation</h1>
      <ReservationForm
      formInitialState={form}
      handleSubmit={handleSubmit}
      handleFormChange={handleFormChange}
      />
    </div>
  );
}

export default NewReservation;
