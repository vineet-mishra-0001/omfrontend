import React from "react";

const Table = ({
  columns,
  data,
  className = "",
  loading = false,
  emptyMessage = "No data available",
  actions,
  onActionClick
}) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b"
              >
                {typeof col === 'object' ? col.label : col}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 border-b">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={actions ? columns.length + 1 : columns.length} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col, colIndex) => {
                  const colKey = typeof col === 'object' ? col.key : col;
                  const colType = typeof col === 'object' ? col.type : undefined;
                  
                  return (
                    <td 
                      key={colIndex} 
                      className="px-6 py-4 text-sm text-gray-600"
                    >
                      {colType === 'image' ? (
                        <img 
                          src={row[colKey] || "/api/placeholder/32/32"} 
                          alt="Item" 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        row[colKey]
                      )}
                    </td>
                  );
                })}
                {actions && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => onActionClick && onActionClick(action.key, rowIndex, row)}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={actions ? columns.length + 1 : columns.length} 
                className="text-center py-8 text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;