import React from 'react'; 
import '../css/Start.css'; 
import { Link } from 'react-router-dom'; 


function Start() {
    return (
      <div className="body">
        <Link to='/chat'>
        <h1 className="entrance">Click To Enter</h1>
        </Link>
      </div>
    );
  }
  
  export default Start;