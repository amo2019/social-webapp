import {firestore} from "../firebase";

const db = firestore.collection(`/events`);
const db2 = firestore.collection(`/events`);
const getdb2 = () => {
  return db2;
};


const getAll = () => {
  return db;
};

const create = (db, data) => {
  return db.add(data);
};

const update = (db, id, value) => {
  return db.doc(id).update(value);
};

const remove = (db, id) => {
  return db.doc(id).delete();
};

const EventService = {
  getAll,
  create,
  update,
  remove,
  getdb2
};

export default EventService;
