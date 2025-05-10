import React, { useState } from 'react';
import Table from './components/tables/Table';

const ProductTable = () => {
  const [loading, setLoading] = useState(false);
  
  // Column definition
  const columns = [
    { key: 'image', label: 'Product', type: 'image' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
  ];
  
  // Sample data
  const products = [
    { 
      image: null, 
      name: 'Premium Headphones', 
      category: 'Electronics',
      price: '$249.99',
      stock: '24 units'
    },
    { 
      image: null, 
      name: 'Ergonomic Office Chair', 
      category: 'Furniture',
      price: '$189.95',
      stock: '12 units'
    },
    { 
      image: null,
      name: 'Wireless Bluetooth Speaker', 
      category: 'Electronics',
      price: '$79.99',
      stock: '38 units'
    },
    { 
      image: null,
      name: 'Leather Travel Backpack', 
      category: 'Accessories',
      price: '$124.50',
      stock: '7 units'
    },
  ];
  
  // Action buttons
  const actions = [
    { key: 'edit', label: 'Edit' },
    { key: 'view', label: 'View Details', primary: true }
  ];
  
  const handleActionClick = (actionKey, rowIndex, rowData) => {
    console.log(`Action ${actionKey} clicked for ${rowData.name}`);
  };
  
  // Toggle loading state for demonstration
  const toggleLoading = () => {
    setLoading(prev => !prev);
  };
  
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Product Inventory</h1>
          <div className="space-x-3">
            <button 
              onClick={toggleLoading} 
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              {loading ? 'Stop Loading' : 'Show Loading'}
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
              Add Product
            </button>
          </div>
        </div>
        
        <Table 
          columns={columns}
          data={products}
          actions={actions}
          onActionClick={handleActionClick}
          loading={loading}
          className="bg-white"
        />
      </div>
    </div>
  );
};

export default ProductTable;