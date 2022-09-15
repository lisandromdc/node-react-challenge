import express from 'express';
import axios  from 'axios';
import { parseSvgFile, asyncForEach } from '../utils';
import { File } from '../types';
import { axiosConfig, externalApiUrl } from '../site-config';

export const filesController = {
  // get all available Files or just one by fileName
  getData: (req: express.Request, res: express.Response) => {
    const fileName = req.query.fileName as string;
    if (fileName) {
      getOneFile(res, fileName);
    } else {
      getAllFiles(res);
    }
  },
  // get all names of available Files
  getList: (_req: express.Request, res: express.Response) => {
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
function getFileNames(cb: (fileNames: string[]) => void) {
  axios.get(`${externalApiUrl}/secret/files`, axiosConfig)
  .then((response) => {
    cb(response.data.files as string[]);
  })
  .catch((_error) => {
    cb([]);
  });
}

// get one File by fileName 
function getOneFile(res: express.Response, fileName: string) {
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
function getAllFiles(res: express.Response) {
  getFileNames((fileNames) => {
    if (!fileNames.length) {
      res.send('External API is not available');
      return;
    }
    const allFiles: File[] = [];
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