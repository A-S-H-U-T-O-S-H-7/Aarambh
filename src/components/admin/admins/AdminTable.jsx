// components/admin/admins/AdminTable.jsx
'use client';

import AdminTableRow from "./AdminTableRow";

export default function AdminTable({ admins, currentAdminId, isDark, onEdit, onDelete }) {
  if (admins.length === 0) {
    return (
      <div className={`rounded-2xl border p-12 text-center transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No admins found</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Click "Add Admin" to create one</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
        : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${
            isDark 
              ? "bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 text-gray-200" 
              : "bg-gradient-to-r from-yellow-500/5 via-yellow-400/5 to-yellow-500/5 text-gray-700"
          } border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name & Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-gray-700/50" : "divide-gray-200/50"}`}>
            {admins.map((admin, index) => (
              <AdminTableRow
                key={admin.id}
                admin={admin}
                index={index}
                currentAdminId={currentAdminId}
                isDark={isDark}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}