import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'




// const guestLinks = (

//     <ul>
//     <li><Link to="#!">Developers</Link></li>
//     <li><Link to="/register">Register</Link></li>
//     <li><Link to="/login">Login</Link></li>
//   </ul>


// );

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
    return (
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/">
            <i className="fas fa-code"></i> DevConnector
          </Link>
        </h1>
        <ul>
        <li>
               <Link to="/profiles">{" "}Developers</Link>
               </li>
     
       
         
          {isAuthenticated ? (
              <Fragment>
               <li>
               <Link to="/dashboard"><i className="fas fa-user"></i>{" "}Dashboard</Link>
               </li>
               <li>
               <Link to="/posts">{" "}Posts</Link>
               </li>
               
            
            <li>
              <a onClick={logout} href="#!">
                <i className="fas fa-sign-out-alt"></i>{" "}
                <span className="hide-sm">Logout</span>
              </a>
            </li>
            </Fragment>
            
          ) : (
              <Fragment>
            <li>
              <Link to="/login">Login</Link>
            </li>
             <li>
             <Link to="/register"><span className="hide-sm">Register</span></Link>
           </li>
           </Fragment>
          )}
        </ul>
      </nav>
    );
  };
  

// const authLinks = (

//     <ul>
//          <li><a onClick={logout} href="#!"><i className="i.fas.fa-sign-out-alt"></i><span className="hide-sm">{' '}Logout</span></a></li>
     
//        </ul>

// )


Navbar.propTypes = {

    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired

}

const mapStateToProps = (state) => ({

    auth: state.auth

})

export default connect(mapStateToProps, { logout })(Navbar);
