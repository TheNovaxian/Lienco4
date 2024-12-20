import React,{useState, useEffect, useRef} from 'react'
import './Hero.css'
import Popup from './Popup/Popup'
import Signpop from './Signpop/Signpop'
import Navbar from './Navbar'


const Hero = ({ isLoggedIn,onLogin }) => {

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSignVisible, setIsSignVisible] = useState(false);


const popupRef = useRef(null);
const signRef = useRef(null);



  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const toggleSign = () => {
    setIsSignVisible(!isSignVisible);
 }


 const handleClickOutside = (event) => {
  if (popupRef.current && !popupRef.current.contains(event.target)) {
    setIsPopupVisible(false);
  }
  if (signRef.current && !signRef.current.contains(event.target)) {
    setIsSignVisible(false);
  }
};

useEffect(() => {
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);




  return (
    <div className='hero'>
      {/* <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /> */}
        <div className='content'>

        <h1>LienCo Construction</h1> <br />
        <div className='line'></div>
        <h4>Construction excellence with a little extra.</h4><br />
        
        <div className="btn-hero">
          {!isLoggedIn ? (
            <>
              <button className='login-hero color-1' onClick={togglePopup}><b>Log in</b></button>
              <button className='signup-hero color-2' onClick={toggleSign}><b>Sign up</b></button>
            </>
          ) : null} {/* Hide buttons if logged in */}
        </div>
        <div ref={popupRef}>
          <Popup isVisible={isPopupVisible} onClose={togglePopup} onLogin={onLogin} />
        </div>
        <div ref={signRef}>
          <Signpop isSignVisible={isSignVisible} onClose={toggleSign} />
        </div>
       
        </div>
      
    </div>
  )
}

export default Hero
