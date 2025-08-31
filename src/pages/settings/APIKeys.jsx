import React, { useState } from 'react';

const initialKeys = [
  { name: 'Main API Key', createdAt: '1/7/2024, 3:30:00 PM', lastUsed: '10/7/2024, 5:30:00 PM', permissions: 'read, write', expiresAt: '1/1/2025, 5:29:59 AM', status: 'Active' },
  { name: 'Read Only', createdAt: '1/6/2024, 2:30:00 PM', lastUsed: '-', permissions: 'read', expiresAt: '-', status: 'Inactive' },
  { name: 'Proxy US-East', createdAt: '15/5/2024, 1:30:00 PM', lastUsed: '9/7/2024, 7:30:00 PM', permissions: 'read, proxy', expiresAt: '1/12/2024, 5:29:59 AM', status: 'Active' },
  { name: 'Proxy EU-West', createdAt: '20/4/2024, 5:00:00 PM', lastUsed: '8/7/2024, 3:30:00 PM', permissions: 'read, proxy', expiresAt: '1/11/2024, 5:29:59 AM', status: 'Active' },
  { name: 'Proxy Asia', createdAt: '10/3/2024, 7:15:00 PM', lastUsed: '7/7/2024, 2:30:00 PM', permissions: 'read, proxy', expiresAt: '1/10/2024, 5:29:59 AM', status: 'Active' },
];

const APIKeys = () => {
  const [apiKeys, setApiKeys] = useState(initialKeys);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', permissions: '', expiresAt: '', status: 'Active' });

  const totalPages = Math.ceil(apiKeys.length / rowsPerPage);
  const pagedKeys = apiKeys.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const handleAdd = () => {
    setShowModal(true);
    setForm({ name: '', permissions: '', expiresAt: '', status: 'Active' });
  };
  const handleClose = () => setShowModal(false);
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    setApiKeys(keys => [
      ...keys,
      {
        ...form,
        createdAt: new Date().toLocaleString(),
        lastUsed: '-',
      },
    ]);
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">API Keys</h2>
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">API Keys</span>
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleAdd}>Add API Key</button>
        </div>
        <table className="w-full mb-4 border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Created At</th>
              <th className="text-left py-2">Last Used</th>
              <th className="text-left py-2">Permissions</th>
              <th className="text-left py-2">Expires At</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {pagedKeys.map((key, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{key.name}</td>
                <td className="py-2">{key.createdAt}</td>
                <td className="py-2">{key.lastUsed}</td>
                <td className="py-2">{key.permissions}</td>
                <td className="py-2">{key.expiresAt}</td>
                <td className="py-2">{key.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select className="border rounded px-2 py-1" value={rowsPerPage} onChange={e => {setRowsPerPage(Number(e.target.value)); setPage(1);}}>
            {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="ml-auto px-2" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>&lt; Previous</button>
          <span>{page}</span>
          <button className="px-2" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Next &gt;</button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4">Add API Key</h3>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Name</label>
              <input className="w-full border rounded px-3 py-2" name="name" value={form.name} onChange={handleFormChange} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Permissions</label>
              <input className="w-full border rounded px-3 py-2" name="permissions" value={form.permissions} onChange={handleFormChange} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Expires At</label>
              <input className="w-full border rounded px-3 py-2" name="expiresAt" value={form.expiresAt} onChange={handleFormChange} />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Status</label>
              <select className="w-full border rounded px-3 py-2" name="status" value={form.status} onChange={handleFormChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="px-4 py-2 rounded border" onClick={handleClose}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default APIKeys; 