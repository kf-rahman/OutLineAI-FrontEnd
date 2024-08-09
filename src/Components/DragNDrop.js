import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import "./drag-drop.css";

const FileUploadButton = ({ onFilesSelected }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);

  return (
    <div>
      <input
        type="file"
        hidden
        id="file-upload"
        onChange={handleFileChange}
        accept=".pdf,.docx,.pptx,.txt,.xlsx"
        multiple
      />
      <label htmlFor="file-upload" className="upload-button">
        <AiOutlineCloudUpload /> Upload files
      </label>

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list__container">
            {files.map((file, index) => (
              <div className="file-item" key={index}>
                <div className="file-info">
                  <p>{file.name}</p>
                </div>
                <div className="file-actions">
                  <MdClear onClick={() => handleRemoveFile(index)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;
