import React, { useState } from 'react';

const initialUsers = [
  { email: 'user@example.com', role: 'Owner', status: 'Active', invitedAt: '1/7/2024, 3:30:00 PM', lastActive: '10/7/2024, 5:30:00 PM' },
  { email: 'another@example.com', role: 'Admin', status: 'Invited', invitedAt: '5/7/2024, 2:30:00 PM', lastActive: '-' },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', role: 'Admin', status: 'Invited', invitedAt: '', lastActive: '-' });

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const pagedUsers = users.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const handleInvite = () => {
    setShowModal(true);
    setForm({ email: '', role: 'Admin', status: 'Invited', invitedAt: new Date().toLocaleString(), lastActive: '-' });
  };
  const handleClose = () => setShowModal(false);
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    setUsers(u => [
      ...u,
      {
        ...form,
        invitedAt: form.invitedAt || new Date().toLocaleString(),
        lastActive: form.lastActive || '-',
      },
    ]);
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">Users</span>
          <button className="bg-error text-white px-4 py-2 rounded" onClick={handleInvite}>Invite</button>
        </div>
        <table className="w-full mb-4 border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Invited At</th>
              <th className="text-left py-2">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((user, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{user.email}</td>
                <td className="py-2">{user.role}</td>
                <td className="py-2">{user.status}</td>
                <td className="py-2">{user.invitedAt}</td>
                <td className="py-2">{user.lastActive}</td>
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
            <h3 className="text-xl font-bold mb-4">Invite User</h3>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Email address</label>
              <input className="w-full border rounded px-3 py-2" name="email" value={form.email} onChange={handleFormChange} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Role</label>
              <select className="w-full border rounded px-3 py-2" name="role" value={form.role} onChange={handleFormChange}>
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Status</label>
              <select className="w-full border rounded px-3 py-2" name="status" value={form.status} onChange={handleFormChange}>
                <option value="Active">Active</option>
                <option value="Invited">Invited</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Invited At</label>
              <input className="w-full border rounded px-3 py-2" name="invitedAt" value={form.invitedAt} onChange={handleFormChange} />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Last Active</label>
              <input className="w-full border rounded px-3 py-2" name="lastActive" value={form.lastActive} onChange={handleFormChange} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="px-4 py-2 rounded border" onClick={handleClose}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Invite</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users; 