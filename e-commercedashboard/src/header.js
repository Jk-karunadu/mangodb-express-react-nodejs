import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartFlatbedSuitcase } from '@fortawesome/free-solid-svg-icons';
import './header.css'; // Import the CSS file

const Header = ({ onShowAddModal }) => {
  const auth = localStorage.getItem('user');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/regist');
  };

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Navbar.Brand href="#home" className="d-flex align-items-center">
       
        <FontAwesomeIcon icon={faCartFlatbedSuitcase} className="ms-2" />
        <span className="ms-2">Sastha Mart</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {/* {auth ? ( */}
          <Nav className="me-auto">
            <Link className="nav-link" to="/">Products</Link>
            <Link className="nav-link" to="/profile">Profile</Link>
            <Link className="nav-link" to="#" onClick={onShowAddModal}>Add</Link>
            <Link className="nav-link" onClick={logout} to="/regist">Logout ({JSON.parse(auth).firstname})</Link>
          </Nav>
        {/* ) : ( */}
          <Nav className="ms-auto">
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/regist">Register</Link>
          </Nav>
        {/* )} */}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
