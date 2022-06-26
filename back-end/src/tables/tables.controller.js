const service = require("./tables.service.js");
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");

const REQUIRED_PROPERTIES = ["table_name", "capacity"];

const REQUIRED_PROPERTIES_PUT = ["reservation_id"];

//check if table_name is atleast 2 characters
function characterLength(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length > 1) {
    return next();
  } else {
    return next({
      status: 400,
      message: `${table_name} is not valid. The table_name must have more than 2 characters`,
    });
  }
}

//middleware checks if capacity is a number
function isNumber(req, res, next) {
  const { capacity } = req.body.data;
  //console.log(capacity, "----------------")
  //console.log(typeof capacity, "---------------")
  if (typeof capacity === "number") {
    return next();
  } else {
    return next({
      status: 400,
      message: `${capacity} is not a number. The capacity field requires a number`,
    });
  }
}

//middleware checks if table exist
async function tableExist(req, res, next) {
  const { table_id } = req.params;
  
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    //console.log("no table","---------------------")
    next({
      status: 404,
      message: `Reservation ${table_id} cannot be found.`,
    });
  }
}

//middleware reservation exist
async function reservationExist(req,res,next){
  const { reservation_id } = req.body.data
  const reservation = await reservationService.read(reservation_id)
 // console.log(reservation)
    if(reservation && reservation.status !== "seated"){
      res.locals.reservation = reservation
      return next()
    }else if(reservation && reservation.status ==="seated"){
      return next ({
        status:400,
        message:`reservation_id ${reservation_id} is already seated `
      })
    }else{
      //console.log("does not exist", "--------------------")
        next({ 
          status: 404, 
          message: `reservation_id ${reservation_id} cannot be found.` });
    }  
}

//checks if table have enough capacity to seat people in reservation
function tableCapacity(req, res, next){
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if(capacity >= people){
   //console.log(capacity)
     return next();
  }else{
    return next({
      status:400,
      message: "Table capacity is not suffient"
    })
  }
}

//middleware checks if table is free
function tableStatus(req, res, next){
  const { status } = res.locals.table
 // console.log(status )
  if(status === "free"){
    //console.log("table is free", "----------")
    return next()
  }else{
    return next ({
      status: 400,
      message: `Table is occupied`
    })
  }
}

//middleware checks if table is occupied
// function tableOccupied(req, res, next){
//   const { status } = res.locals.table
//   if(status === "occupied"){
//     return next()
//   }else{
//     return next ({
//       status: 400,
//       message: `Table is not occupied.`
//     })
//   }
// }

function tableOccupied(req, res, next){
  const { reservation_id } = res.locals.table
  if(reservation_id){
    return next()
  }else{
    return next ({
      status: 400,
      message: `Table is not occupied.`
    })
  }
}

// function read(req, res){
//   const { table } = res.locals
//   res.json({ data: table })
// }

async function list(req, res) {
  const table = await service.list();
  res.json({ data: table });
}

async function create(req, res) {
  const table = await service.create(req.body.data);
  res.status(201).json({ data: table });
}

//seat a resevation at a table
async function seatTable(req,res){
  const { table } = res.locals;
  const { table_id } = req.params;
  // const table = await service.read(table_id);
  const { reservation_id } = res.locals.reservation;
  //console.log(reservation_id,"-------------------")
  const updatedTableData = {
    ...table,
    table_id: table_id,
    reservation_id: reservation_id,
    status: "occupied",
  }
  //console.log(updatedTableData,"-----------------")
  const updatedTable= await service.update(updatedTableData)
  //console.log(updatedTable,"----------------")
  const reservationUpdate ={
    status: "seated",
    reservation_id: reservation_id,
    }
    await reservationService.update(reservationUpdate)
    //console.log(updatedTable,"-----------------")
    res.json({ data: updatedTable })
}

// finish an occupied table
async function finish(req, res) {
  const { table } = res.locals;
  const updatedTableData = {
      ...table,
      reservation_id: null,
      status: "free"
  }
  const updatedTable = await service.finish(updatedTableData);
  const updatedReservation = {
      status: "finished", 
      reservation_id: table.reservation_id,
  }
  await reservationService.update(updatedReservation); 
  res.json({ data: updatedTable });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProperties(...REQUIRED_PROPERTIES),
    characterLength,
    isNumber,
    asyncErrorBoundary(create),
  ],
  seatTable:[
     hasProperties(...REQUIRED_PROPERTIES_PUT),
     asyncErrorBoundary(tableExist),
     asyncErrorBoundary(reservationExist),
    tableCapacity,
    tableStatus,
    asyncErrorBoundary(seatTable)
  ],
  finish:[
    asyncErrorBoundary(tableExist),
    tableOccupied,
    asyncErrorBoundary(finish),
  ]
};
