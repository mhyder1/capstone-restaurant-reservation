/**
 * List handler for reservation resources
 */

 const service = require("./reservations.service.js")
 const hasProperties = require("../errors/hasProperties");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 const reservations = require("../db/seeds/00-reservations.json");
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties.js");
 
 const REQUIRED_PROPERTIES = [
   "first_name",
   "last_name",
   "mobile_number",
   "reservation_date",
   "reservation_time", 
   "people"
 ];

 const VALID_PROPERTIES = [
  ...REQUIRED_PROPERTIES,
  "status",
  "reservation_id", 
  "created_at", 
  "updated_at",
]
 
 // middleware checks if the date is valid
 function isDateValid(req, res, next){
   const { reservation_date }  = req.body.data;
   const date = Date.parse(reservation_date);
   //console.log({ date })
   //console.log(isNaN(date),"------------")
   if(isNaN(date) ){
     return next({
       status: 400,
       message:`${reservation_date} invalid. Please format reservation_date correctly`
     })
   }else{
     return next()
   }
 }
 
 function timeIsATime(req, res,next){
   const {reservation_time } = req.body.data;
   const regex = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
   if (regex.test(reservation_time)){
     return next()
   }else{
     return next({
       status: 400,
       message: `${reservation_time} is not a time. The reservation_time field requires a time`
     })
   }
 }
 
 //middleware checks if the value of people is a number
 function peopleIsANumber(req, res, next){
   const { people } = req.body.data;
   //const peopleInt = parseInt(people)
   //console.log(typeof peopleInt,"------------")
   if(typeof people === 'number'){
     return next();
   }else{
     return next({
       status: 400,
       message: `${people} is not a number. The people field requires a number`
     })
   }
 }

 //middleware check if reservation is for Tuesday
 function notTuesday(req, res, next){
  const { reservation_date } = req.body.data;
  const day = new Date(reservation_date);
  const resDay =  day.getUTCDay();
  if(resDay !== 2){
    return next()
  }else{
    return next({
      status: 400,
      message: `The resturant is closed on Tuesdays`
    })
  }
}

//middleware checks if reservation_date is in the past
function notInThePast(req, res, next){
  const { reservation_date, reservation_time } = req.body.data;
  const now = Date.now()
  const reservation =  new Date(`${reservation_date} PDT`).setHours(reservation_time.substring(0, 2), reservation_time.substring(3))
  //console.log(reservation)
  if (reservation > now){
    return next();
  }else{
    next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }
}

//middleware check if reservation time is during operating hours
function duringOperatingHours(req, res, next) {
  const { reservation_time } = req.body.data;
  //console.log (reservation_time, "--------")
  const open = 1030;
  const close = 2130;
  const reservation = reservation_time.substring(0, 2) + reservation_time.substring(3);
  //console.log(reservation_time.substring(0, 2), "--------")
  //console.log(reservation_time.substring(3), "--------")
  if (reservation > open && reservation < close) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservations are only allowed between 10:30am and 9:30pm",
    });
  }
}

//middleware checks if reservation exists
async function reservationExist(req,res,next){
  const { reservationId } = req.params
  const reservation = await service.read(reservationId)
    if(reservation){
      res.locals.reservation = reservation
      //console.log(reservation,"----------")
      return next()
    }else{
      //console.log("no reservation","---------------------")
        next({ 
          status: 404, 
          message: `Reservation ${reservationId} cannot be found.` });
    }  
}

//middleware checks the request query by date and phone
async function byDateAndPhone(req, res, next) {
  const { date, mobile_number } = req.query;
  if (date) {
    const reservations = await service.list(date);
    if (reservations.length) {
      res.locals.data = reservations;
      return next();
    } else {
      return next({
        status: 404, 
        message: `There are currently no pending reservations for ${date}`,
      });
    }
  } 
  if (mobile_number) {
    const reservation = await service.find(mobile_number);
    res.locals.data = reservation;
    return next();
  }
}



//middleware to check reservation status
function reservationStatus(req, res, next){
  const { status } = req.body.data
  //console.log(status, "--------------")
  if (status){
    
    if (status === "booked"){
      return next()
    }else {
      return next({
        status: 400, 
        message: `Reservation status is ${status}, cannot create new reservation.`,
      });
    }
  }else{
    return next()
  }
}

//middleware to check reservation status
function reservationStatusForUpdate(req, res, next){
  const { status } = req.body.data
  //console.log(status, "--------------")
  validStatuses = ["booked", "seated", "finished", "cancelled"]
  if (validStatuses.includes(status)){
   res.locals.status = status;
   //console.log("correct status","----------")
    return next()
  
  }else {
    return next({
      status: 400, 
      message: `Reservation status is ${status}. This is invaild`,
    })
  }
}

//middleware checks if status is finished
function statusIsFinished(req, res, next){
  const { reservation } = res.locals;
  //console.log(reservation.status,"-----------")
  if(reservation.status === "finished"){
    return next({
      status: 400,
      message: "A finished reservation cannot be updated"
    })
  }else{
    return next()
  }
}

function list(req, res) {
  const { data } = res.locals;
  res.json({ data: data });
}
 
 async function create(req,res){
   const reservation = await service.create(req.body.data);
   res.status(201).json({ data:reservation })
 }

 function read(req, res){
  const { reservation } = res.locals
  //console.log(reservation, "------------")
  res.json({ data: reservation })
}

// updates a reservation status
async function updateStatus(req, res) {
  const { reservation, status } = res.locals
  //console.log(status, "------------")
  const updatedReservationData = {
    ...reservation,
    status: status,
  }
  const updatedReservation = await service.update(updatedReservationData);
  //console.log(updatedReservation)
  res.json({ data: updatedReservation });
}
 
 async function updateReservation(req,res){
  const { reservation } = res.locals;
    //console.log(reservation,"--------")
    const { data } = req.body;
    //console.log(data, "-------------")
    const updatedReservationData = {
      ...reservation,
      ...data,
    }
    const updatedReservation = await service.update(updatedReservationData);
    
    res.json({ data: updatedReservation });
  
 }
 
 
 module.exports = {
   list: [
    asyncErrorBoundary(byDateAndPhone),
    list
   ],
   create: [
     hasProperties(...REQUIRED_PROPERTIES),
     isDateValid,
     peopleIsANumber,
     timeIsATime,
     notTuesday,
     notInThePast,
     duringOperatingHours,
     reservationStatus,
     asyncErrorBoundary(create),
     ],
     read: [
      asyncErrorBoundary(reservationExist),
       asyncErrorBoundary(read),
     ],
     updateStatus:[
      hasProperties("status"),
      hasOnlyValidProperties("status"),
      asyncErrorBoundary(reservationExist),
      reservationStatusForUpdate,
      statusIsFinished,
      asyncErrorBoundary(updateStatus),
     ],
     updateReservation:[
      asyncErrorBoundary(reservationExist),
      hasProperties(...REQUIRED_PROPERTIES),
      isDateValid,
     peopleIsANumber,
     timeIsATime,
     asyncErrorBoundary(updateReservation)
     ]
 };
 
