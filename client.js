const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./file.proto');
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const crudService = protoDescriptor.crud.CrudService;

const client = new crudService('localhost:50051', grpc.credentials.createInsecure());

// request untuk membuat data  
function create(name, NRP) {
  const request = { name, NRP };
  return new Promise((resolve, reject) => {
    client.create(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response.id);
      }
    });
  });
}

// request untuk menampilkan data  
function read(id) {
  const request = { id };
  return new Promise((resolve, reject) => {
    client.read(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

// request untuk update data  
function update(id, name, NRP) {
  const request = { id, name, NRP };
  return new Promise((resolve, reject) => {
    client.update(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// request untuk menghapus data  
function remove(id) {
  const request = { id };
  return new Promise((resolve, reject) => {
    client.delete(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// membuat dua kali input revisi operasi
function askQuestion(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function main() {
  try {

    // input pertama 
    const name = await askQuestion('Name: ');
    const NRP = await askQuestion('NRP: ');
    const id = await create(name, NRP);
    console.log('Data berhasil masuk dengan ID :', id);
    const user = await read(id);
    console.log('Data :', user);

    // input kedua -> untuk revisi operasi 
    const newName = await askQuestion('New name: ');
    const newNRP = await askQuestion('New NRP: ');
    await update(id, newName, newNRP);
    console.log('Data berhasil diupdate!');
    await remove(id);
    console.log('Data berhasil dihapus!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

main();