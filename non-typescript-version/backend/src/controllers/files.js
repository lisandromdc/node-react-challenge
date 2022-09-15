import axios  from 'axios';
import { parseSvgFile, asyncForEach } from '../utils.js';
import { axiosConfig, externalApiUrl } from '../site-config.js';

export const filesController = {
  // get all available Files or just one by fileName
  getData: (req, res) => {
    const fileName = req.query.fileName;
    if (fileName) {
      getOneFile(res, fileName);
    } else {
      getAllFiles(res);
    }
  },
  // get all names of available Files
  getList: (_req, res) => {
    getFileNames((fileNames) => {
      if (!fileNames.length) {
        res.send('External API is not available');
        return;
      }
      res.send({
        files: fileNames
      });
    });
  },
}

// get array of file names
function getFileNames(cb) {
  axios.get(`${externalApiUrl}/secret/files`, axiosConfig)
  .then((response) => {
    cb(response.data.files);
  })
  .catch((_error) => {
    cb([]);
  });
}

// get one File by fileName 
function getOneFile(res, fileName) {
  console.log('fileName', fileName);
  parseSvgFile(fileName, (parsedFile) => {
    if (parsedFile) {
      res.send(JSON.stringify(parsedFile));
    } else {
      res.send('File not found');
    }
  });
}

// get all available Files 
function getAllFiles(res) {
  getFileNames((fileNames) => {
    if (!fileNames.length) {
      res.send('External API is not available');
      return;
    }
    const allFiles = [];
    asyncForEach(fileNames, (fileName, itemCallback) => {
      parseSvgFile(fileName, (parsedFile) => {
        if (parsedFile) allFiles.push(parsedFile);
        itemCallback();
      });
    }, () => {
      res.send(JSON.stringify(allFiles));
    });
  });
}