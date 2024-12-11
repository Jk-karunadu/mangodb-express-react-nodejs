import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Products.css'; // Import the CSS file

const Product = ({ onUpdateProduct }) => {
  const [products, setprod] = useState([]);
  const [data, setdata] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false); // State to trigger data refetch

  useEffect(() => {
    collectdata();
  }, [updateTrigger]); // Refetch data when updateTrigger changes

  const collectdata = async () => {
    let result = await fetch(`${import.meta.env.VITE_REACT_APP_URL}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
      }
    });
    result = await result.json();
    setprod(result);
  };

  const search = async (e) => {
    setdata(e.target.value);
    let key = e.target.value;
    let result = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/search/${key}`);
    result = await result.json();
    if (result) {
      setprod(result);
    }
  };

  const handleUpdateClick = (product) => {
    onUpdateProduct(product);
    setUpdateTrigger(prev => !prev); // Toggle to trigger data refetch
  };

  const deletedata = async (_id) => {
    let dlt = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/delete`, {
      method: 'delete',
      body: JSON.stringify({ _id }),
      headers: {
        'Content-Type': "application/json"
      }
    });
    dlt = await dlt.json();
    if (dlt) {
      collectdata();
    }
  };

  return (
    <div className="product-container">
      <h1 className="page-title">Product Page</h1>
      <div className="search-container">
        <Form inline>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                value={data}
                placeholder="Search"
                className="search-input"
                onChange={search}
              />
            </Col>
            <Col xs="auto">
              <Button variant='dark' className="clear-button" onClick={() => setdata("")}>Clear</Button>
            </Col>
          </Row>
        </Form>
      </div>
      {products.length > 0 ? (
        <Table className="product-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>ID</th>
              <th>Price</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              products.map((item, i) =>
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.id}</td>
                  <td>${item.price}</td>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>
                    <Button className="delete-button" variant="danger" onClick={() => { deletedata(item._id) }}>Delete</Button>
                    <Button className="update-button" variant="primary" onClick={() => handleUpdateClick(item)}>Update</Button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
      ) : (
        <span className='no-result'>No data found!</span>
      )}
    </div>
  );
};

export default Product;
