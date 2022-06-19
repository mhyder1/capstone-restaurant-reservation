const { response } = require("express");
const knex = require("../db/connection")

//get list of table
function list(date){
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}

//post a new table
function create(table){
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecorcds) => createdRecorcds[0] )

}

// read table by table_id
function read(table_id){
    return knex("tables")
        .select("*")
        .where({ table_id })
        .then((response) => response[0])
}

function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
        .then((updatedTables) => updatedTables[0]);
}

function finish(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
        .then((updatedTables) => updatedTables[0]);
}

module.exports = {
    create,
    list,
    read,
    update,
    finish,
}