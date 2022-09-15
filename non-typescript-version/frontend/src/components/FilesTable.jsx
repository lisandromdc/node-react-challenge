import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

import FilterFilesTable from './FilterFilesTable';
import { databaseUrl } from '../site-config';
import '../assets/files-table.css';

export default function MainTitle() {
  const [filesList, setFilesList] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const filteredFiles = (files) => {
    if (!selectedFileName) return files;
    return files.filter((file) => file.file === selectedFileName);
  }
  const loadFiles = () => {
    return axios.get(`${databaseUrl}/files/data`).then((response) => {
      const parsedFiles = [];
      response.data.forEach((file) => {
        file.lines.forEach((line) => {
          parsedFiles.push({
            ...line,
            file: file.file,
          });
        });
      });
      setFilesList(parsedFiles);
    });
  }
  useEffect(() => {
    loadFiles();
  }, []);
  return (
    <div className="files-table">
      {!filesList.length && <span className="loading-sign">Cargando...</span>}
      {!!filesList.length && <FilterFilesTable
      selectedFileName={selectedFileName}
      clearSelection={() => setSelectedFileName('')}
      />}
      {!!filesList.length && <Table striped bordered>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Text</th>
            <th>Number</th>
            <th>Hex</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles(filesList).map((item, index) => (
            <tr key={index}>
              <td>
                <span className="file-name" onClick={() => setSelectedFileName(item.file)}>
                  {item.file}
                </span>
              </td>
              <td>{item.text}</td>
              <td>{item.number}</td>
              <td>{item.hex}</td>
            </tr>
          ))}
        </tbody>
      </Table>}
    </div>
  );
}