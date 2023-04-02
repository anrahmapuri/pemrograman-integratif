const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./file.proto');
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const crudService = protoDescriptor.crud.CrudService;

const client = new crudService('localhost:50051', grpc.credentials.createInsecure());

// request untuk membuat data  
function create(username, password) {
  const request = { username, password };
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
function update(id, username, password) {
  const request = { id, username, password };
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
    const choice = await askQuestion('Halo! Selamat datang di Passwod Manager :D \nSilakan pilih fitur di bawah ini \n1. Menambahkan Data \n2. Menampilkan Data \n3. Merevisi Data\n4. Menghapus\nPilihanmu? ');
    switch (choice) {
      case '1': {
        const username = await askQuestion('username: ');
        const password = await askQuestion('password: ');
        const id = await create(username, password);
        console.log(`Data berhasil masuk dengan ID : ${id}`);
        break;
      }
      case '2': {
        const id = await askQuestion('ID : ');
        try {
          const users = await read(id);
          console.log('Data:', users);
        } catch (err) {
          console.error(`Data dengan username : ${username} tidak terdeteksi!`);
        }
        break;
      }
      case '3': {
        const id = await askQuestion('ID: ');
        const ussename = await askQuestion('Masukan username baru : ');
        const password = await askQuestion('Masukan password baru : ');
        await update(id, ussename, password);
        console.log('Data berhasil direvisi!');
        break;
      }
      case '4': {
        const id = await askQuestion('ID: ');
        await remove(id);
        console.log('Data berhasil dihapus!');
        break;
      }
      default: {
        console.log('ERROR: pilihanmu salah D:');
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

main();
