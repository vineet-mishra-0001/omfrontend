import React from "react";

const Input = ({ 
  type = "text", 
  placeholder, 
  value, 
  name,
  onChange, 
  label,
  error,
  disabled = false,
  className = "",
  id,
  required = false,
  onFocus,
  onBlur,
  isExpanded = false
}) => {
  const uniqueId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`w-full mb-4 transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-12'}`}>
      {label && (
        <label 
          htmlFor={uniqueId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={uniqueId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2.5 bg-white border rounded-md
            outline-none transition-all duration-300
            ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-700'}
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'}
            ${isExpanded ? 'rounded-b-none' : ''}
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;