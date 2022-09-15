import axios  from 'axios';
import csvToJson from 'csvtojson';
import { File, Line } from './types';

import { axiosConfig, externalApiUrl } from './site-config';

// converts svg files to a parsed array of type Line[]
export const parseSvgLines = (cvg: string, cb: (lines: Line[]) => void) => {
  csvToJson({
    // checkColumn: true,
    includeColumns: /(text|number|hex)/,
  })
  .fromString(cvg)
  .then((newJson: any[]) => {
    const justFullFilledRows = newJson.filter((row) => {
      if (typeof row.text === 'undefined') return false;
      if (typeof row.number === 'undefined') return false;
      if (typeof row.hex === 'undefined') return false;
      return true;
    });
    cb(justFullFilledRows);
  })
}

// walk through an array wich executes async functions
// and call a final callback after all functions are completed 
export const asyncForEach = (
  list: any[],
  itemCallback: (item: any, callback: () => void) => void,
  finalCallback: (response?: any) => void,
) => {
  let itemsProcessed = 0;
  list.forEach((item, _index, array) => {
    itemCallback(item, () => {
      itemsProcessed++;
      if(itemsProcessed === array.length) {
        finalCallback();
      }
    });
  });
}

// get file in svg format
export const getSvgFile = (file: string, cb: (cvg?: string) => void) => {
  axios.get(`${externalApiUrl}/secret/file/${file}`, axiosConfig)
  .then((response) => {
    cb(response.data)
  })
  .catch((_error) => {
    cb(undefined);
    // console.log('error', error.response);
    // console.log('error', error.request);
  });
}

// turn svg file to File
export const parseSvgFile = (file: string, cb: (parsedFile?: File) => void) => {
  getSvgFile(file, (csv) => {
    if (!csv) {
      cb(undefined);
      return;
    }
    parseSvgLines(csv, (lines) => {
      if (!lines || !lines.length) {
        cb(undefined);
        return;
      }
      const parsedJson: File = {
        file,
        lines,
      };
      cb(parsedJson);
    });
  })
}