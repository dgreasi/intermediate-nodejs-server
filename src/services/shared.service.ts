import axios from 'axios';

async function makeHTTP(inputReq) {
  return new Promise((resolve, reject) => {
      axios({ url: inputReq, headers: { 'User-Agent': 'request' } }).then((response) => {
          resolve(response.data);
      }).catch((error) => {
          reject(error);
      });
  });
}

export { makeHTTP };
