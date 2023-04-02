const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nyobaPI.firebaseio.com'
});

const packageDefinition = protoLoader.loadSync('./file.proto');
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const crudService = protoDescriptor.crud.CrudService;

function create(call, callback) {
  const data = call.request;
  const collection = admin.firestore().collection('users');
  collection.add(data)
    .then((doc) => {
      callback(null, { id: doc.id });
    })
    .catch((err) => {
      callback(err);
    });
}

function read(call, callback) {
  const id = call.request.id;
  const collection = admin.firestore().collection('users');
  collection.doc(id).get()
    .then((doc) => {
      if (doc.exists) {
        callback(null, doc.data());
      } else {
        callback({ code: grpc.status.NOT_FOUND, details: 'Not found' });
      }
    })
    .catch((err) => {
      callback(err);
    });
}

function update(call, callback) {
  const data = call.request;
  const collection = admin.firestore().collection('users');
  collection.doc(data.id).update(data)
    .then(() => {
    callback(null, {});
  })
  .catch((err) => {
    callback(err);
  });
}

function remove(call, callback) {
  const id = call.request.id;
  const collection = admin.firestore().collection('users');
  collection.doc(id).delete()
    .then(() => {
    callback(null, {});
  })
  .catch((err) => {
    callback(err);
  });
}

function main() {
const server = new grpc.Server();
server.addService(crudService.service, {
  create: create,
  read: read,
  update: update,
  delete: remove
});
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://127.0.0.1:3000');
server.start();
}

main();
