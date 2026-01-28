import { Link } from "react-router-dom";
import img from '../assets/images/not-found.svg';
import Wrapper from "../assets/wrappers/ErrorPage";

const Error = () => {
  return (
    <Wrapper>
      <div className="full-page">
        <img src={img} alt="not found" />
        <h3>Oops! Page not found</h3>
        <p>We couldn't find the page you're looking for.</p>
        <Link to="/" className="btn btn-hero">
          Back Home
        </Link>
      </div>
    </Wrapper>
  );
}  
export default Error;