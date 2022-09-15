import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';

import { internalApiUrl } from '../src/site-config';
import { File } from '../src/types';
// import { app } from  '../src/index';

// attempt to automatically run the server
// before((done) => {
//   app.on('app_started', () => {
//     doneApp()
//   });
// });

describe('files suite', () => {
  it('get all file names', (done) => {
    axios.get(`${internalApiUrl}/files/list`).then((response) => {
      const fileNames: string[] = response?.data?.files;
      checkResponseExists(response, fileNames);
      expect(fileNames?.every((fileName) => typeof fileName === 'string'), 'every item is a string').to.be.true;
      done();
    }).catch((err) => {
      done(err);
    })
  });
  it('get all files', (done) => {
    axios.get(`${internalApiUrl}/files/data`).then((response) => {
      const files: File[] = response?.data;
      checkResponseExists(response, files);
      expect(files?.every(checkIsFileType), 'every item is a file').to.be.true;
      done();
    }).catch((err) => {
      done(err);
    })
  });
  it('get one file', (done) => {
    axios.get(`${internalApiUrl}/files/data?fileName=test3.csv`).then((response) => {
      const file: File = response?.data;
      checkResponseExists(response, file);
      expect(checkIsFileType(file), 'item is a file').to.be.true;
      done();
    }).catch((err) => {
      done(err);
    })
  });
});

function checkIsFileType(file?: File) {
  if (!file) return false;
  if (typeof file.file !== 'string') return false;
  if (!file.lines?.length) return false;
  if (!file.lines[0].text) return false;
  if (!file.lines[0].number) return false;
  if (!file.lines[0].hex) return false;
  return true;
}
function checkResponseExists(response: AxiosResponse, value: any) {
  expect(value, 'exists').to.exist;
  expect(response.status).to.equal(200, 'success response');
}