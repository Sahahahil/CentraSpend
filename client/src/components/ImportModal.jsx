import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ImportModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const form = new FormData();
      form.append('file', file);
      await API.post('/expenses/import', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
    },
    [token, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': [] } });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
        <h3 className="text-lg font-semibold mb-4">Import Expenses (CSV)</h3>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto text-3xl mb-2" />
          {isDragActive ? <p>Drop the file here …</p> : <p>Drag & drop a CSV file here, or click to select</p>}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
