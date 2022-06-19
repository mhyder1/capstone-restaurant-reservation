const knex = require("../db/connection")

//get list of reservations
function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date})
        .whereNot({ status: "finished"})
        .andWhereNot({ status: "cancelled" })
        .orderBy("reservation_time");
}


//post a new reservation
function create(reservation){
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecorcds) => createdRecorcds[0] )

}

//read reservation by reservationId
function read(reservationId){
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .then((response) => response[0])
}


//updates reservation status
function update(updatedReservation){
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then((updatedReservations) => updatedReservations[0]);
}


//finds reservstion by phone number
function find(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

module.exports = {
    create,
    list,
    read,
    update, 
    find,
}