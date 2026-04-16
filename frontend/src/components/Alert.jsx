import React from 'react';

export default function Alert({ type = 'info', message, onClose }) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className={`p-4 border rounded-lg ${typeStyles[type] || typeStyles.info}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg leading-none opacity-50 hover:opacity-75 ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
