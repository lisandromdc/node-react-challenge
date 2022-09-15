import MainTitle from './components/MainTitle';
import FilesTable from './components/FilesTable';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/app.css';

function App() {
  return (
    <div className="App">
      <MainTitle />
      <FilesTable />
    </div>
  )
}

export default App
