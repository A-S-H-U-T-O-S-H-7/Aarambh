// components/admin/admins/PermissionSelector.jsx
'use client';

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AVAILABLE_PERMISSIONS } from "@/lib/services/adminManagementService";

export default function PermissionSelector({ selectedPermissions, onChange, isDark }) {
  const [expandedCategories, setExpandedCategories] = useState({
    Dashboard: true,
    "Daily Management": true,
    Bhajans: true,
    Videos: true,
    Stories: true,
    Temples: true,
    Festivals: true,
    Astro: true,
    Users: true,
    Subscribers: true,
    Admins: true,
    Messages: true,
    Leads: true,
    Activity: true,
    Settings: true,
  });

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const togglePermission = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      onChange(selectedPermissions.filter(p => p !== permissionId));
    } else {
      onChange([...selectedPermissions, permissionId]);
    }
  };

  const selectAllInCategory = (category, permissions) => {
    const allIds = permissions.map(p => p.id);
    const allSelected = allIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      onChange(selectedPermissions.filter(p => !allIds.includes(p)));
    } else {
      const newPermissions = [...selectedPermissions];
      allIds.forEach(id => {
        if (!newPermissions.includes(id)) newPermissions.push(id);
      });
      onChange(newPermissions);
    }
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-300 ${
      isDark 
        ? "border-gray-700 bg-gray-900/50" 
        : "border-gray-200 bg-gray-50/50"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <label className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          Custom Permissions
        </label>
        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Select specific permissions
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
        {Object.entries(groupedPermissions).map(([category, permissions]) => (
          <div key={category} className={`rounded-lg border overflow-hidden transition-all duration-200 ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className={`w-full flex items-center justify-between p-2 text-left text-xs font-medium transition-all duration-200 cursor-pointer ${
                isDark 
                  ? "hover:bg-gray-700 text-gray-200 bg-gray-800/50" 
                  : "hover:bg-gray-100 text-gray-700 bg-gray-50"
              }`}
            >
              <span>{category}</span>
              {expandedCategories[category] ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            
            {expandedCategories[category] && (
              <div className="p-2 pt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => selectAllInCategory(category, permissions)}
                  className={`text-[10px] mb-1 inline-block transition-colors cursor-pointer ${
                    isDark ? "text-yellow-400 hover:text-yellow-300" : "text-yellow-600 hover:text-yellow-700"
                  }`}
                >
                  {permissions.every(p => selectedPermissions.includes(p.id)) ? "Deselect All" : "Select All"}
                </button>
                {permissions.map(permission => (
                  <label key={permission.id} className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 focus:ring-2 focus:ring-yellow-400/20 cursor-pointer"
                    />
                    <span className={`text-[11px] transition-colors ${
                      isDark 
                        ? selectedPermissions.includes(permission.id) ? "text-gray-200" : "text-gray-500 group-hover:text-gray-400"
                        : selectedPermissions.includes(permission.id) ? "text-gray-700" : "text-gray-500 group-hover:text-gray-600"
                    }`}>
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}