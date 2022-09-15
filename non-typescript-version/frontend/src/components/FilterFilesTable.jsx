import '../assets/filter-files-table.css';

export default function MainTitle({ selectedFileName, clearSelection }) {
  return (
    <div className="filter-files-table">
      {!selectedFileName && <span className="help-msg">You can filter by clicking on the file name</span>}
      {selectedFileName && <span className="filtering-file-name" onClick={clearSelection}>
        Filtering by "{selectedFileName}"
        <span className="close-btn">x</span>
      </span>}
    </div>
  );
}