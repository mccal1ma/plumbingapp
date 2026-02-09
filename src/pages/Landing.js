
import main from '../assets/images/main-plumbing2.svg';
import  Wrapper  from '../assets/wrappers/LandingPage';
import {Logo} from '../components/index';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
<Link to="/register" className='btn btn-hero'>
          Login/Register
        </Link>
      </nav>
      <div className="container page">
      <div className='info'>
        <h1>First Time <span>plumbing</span> Co</h1>
        <h3>Get it done right <span>the first time.</span></h3>
        <p>
          A 20 year old company dedicated to providing top-notch plumbing services with a focus on punctuality and customer satisfaction. Our team of experienced professionals is committed to delivering reliable solutions for all your plumbing needs.
        </p>
        
      </div>
        <img src={main} alt="main" className='img main-img'/>
        
      </div>
    </Wrapper>
  );
}

 
export default Landing;