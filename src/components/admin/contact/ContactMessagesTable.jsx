// components/admin/messages/ContactMessagesTable.jsx
'use client';

import Pagination from "../Pagination";
import ContactMessagesTableRow from "./ContactMessagesTableRow";
import { Mail } from "lucide-react";

export default function ContactMessagesTable({ 
  messages, 
  currentPage, 
  totalPages, 
  isDark, 
  onView, 
  onMarkReplied, 
  onDelete,
  onPageChange 
}) {
  if (messages.length === 0) {
    return (
      <div className={`rounded-2xl border p-12 text-center transition-all duration-300 ${
        isDark 
          ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg backdrop-blur-sm' 
          : 'border-gray-200/50 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No messages found</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Customer messages will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg backdrop-blur-sm' 
        : 'border-gray-200/50 bg-white/80 shadow-md backdrop-blur-sm'
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
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-gray-700/50" : "divide-gray-200/50"}`}>
            {messages.map((message, index) => (
              <ContactMessagesTableRow
                key={message.id}
                message={message}
                index={index}
                isDark={isDark}
                onView={onView}
                onMarkReplied={onMarkReplied}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isDark={isDark}
      />
    </div>
  );
}