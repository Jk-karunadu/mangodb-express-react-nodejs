import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './header';
import AddModal from './AddModal';
import UpdateModal from './UpdateModal';
import Footer from './footer';
import Product from './products';
import Profile from './profile';
import Login from './login'
import Regist from './register'
function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});

  const handleAddProduct = async (newProduct) => {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/add`, {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    if (result._id) {
      alert('Product added successfully');
      // Optionally, refetch product list or update state
    } else {
      alert('Error adding product');
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    console.warn('uProducts:', updatedProduct);
    console.warn('cproduct:', currentProduct);
  
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/update/${currentProduct._id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedProduct),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    const result = await response.json();
    if (result) {
      alert('Product updated successfully');
      // Trigger the parent component or refetch the data in the `Product` component
      return result;
    } else {
      alert('Error updating product');
    }
  };
  

  return (
    <div className="App">
      <BrowserRouter>
        <Header onShowAddModal={() => setShowAddModal(true)} />
        <Routes>
          <Route
            path="/"
            element={<Product onUpdateProduct={(product) => {
              setCurrentProduct(product);
              setShowUpdateModal(true);
            }} />}
          />
           <Route
            path="/profile"
            element={<Profile />}
          />
           <Route
            path="/login"
            element={<Login />}
          />
           <Route
            path="/regist"
            element={<Regist />}
          />
        </Routes>
      </BrowserRouter>
      <Footer />

      {/* Modals */}
      <AddModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAddProduct={handleAddProduct}
      />
      <UpdateModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        productData={currentProduct}
        handleUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
}

export default App;
