
import React, { useState, useEffect }from 'react';
import { useHistory, useParams } from "react-router";
import ReservationForm from './ReservationForm';
import ErrorAlert from '../ErrorAlert';
import { notOnTuesday, inTheFuture   } from '../../utils/date-time';
import { readReservation, editReservation } from '../../utils/api';




function Edit() {
  const [error, setError] = useState(null)
  const history = useHistory();
  const { reservation_id } = useParams();
  const [reservationData, setReservationData] = useState(null);

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    
    setError(null);
    
    readReservation(reservation_id, abortController.signal)
      .then(setReservationData)
      .catch(setError);

    return () => abortController.abort();
  }

  const findErrors = (reservation, errors) => {
    notOnTuesday(reservation.reservation_date, errors);
    inTheFuture(reservation.reservation_date, errors);
    //in-line validation to ensure reservation can be modified
    if (reservation.status && reservation.status !== "booked") {
      errors.push(
        <li key="not booked">Reservation can no longer be changed</li>
      );
    }
  };


  const handleSubmit = async(event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = [];
    findErrors(reservationData, errors);
    if(errors.length){
      setError({ message:errors })
      return;
    }
    try {
      reservationData.people = Number(reservationData.people);
      await editReservation(reservation_id, reservationData, abortController.signal);
      history.push(`/dashboard?date=${reservationData.reservation_date}`);
    } catch (error){

      setError(error)
    }
    return () => abortController.abort();
  }
 
  const handleFormChange = (e) => {
    setReservationData({
      ...reservationData,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <div>
      <h1>Edit Reservation:</h1>
      <ErrorAlert error={error} />
      <ReservationForm
        formInitialState={reservationData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default Edit