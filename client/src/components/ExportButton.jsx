import React from 'react';
import { FiDownload } from 'react-icons/fi';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ExportButton = () => {
  const { token } = useAuth();

  const handleExport = async () => {
    const response = await API.get('/expenses/export', {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` },
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
    >
      <FiDownload /> Export CSV
    </button>
  );
};
