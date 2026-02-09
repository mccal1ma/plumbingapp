import { useState } from "react";
import { FormRow } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {updateUser} from "../../features/user/userSlice";
import { formatPhoneNumber, formatPhoneInput, stripPhoneFormatting } from "../../utils/phoneFormatter";

const Profile = () => {
  const { isLoading, user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    email: user?.email || "",
    lastName: user?.lastName || "",
    location: user?.location || "",
    phone: formatPhoneNumber(user?.phone) || "",
  });
  const { firstName, email, lastName, location, phone } = userData;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !email || !lastName || !location) {
      toast.error("Please fill out all fields");
      return;
    }
    // dispatch update user with stripped phone formatting
    // Backend expects 'name' not 'firstName'
    const submitData = { 
      name: firstName, 
      email, 
      lastName, 
      location, 
      phone: stripPhoneFormatting(phone) 
    };
    dispatch(updateUser(submitData));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    
    // Format phone number as user types
    if (name === 'phone') {
      value = formatPhoneInput(value);
    }
    
    setUserData({ ...userData, [name]: value });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        <div className="form-center">
          <FormRow
            type="text"
            name="firstName"
            value={firstName}
            handleChange={handleChange}
            labelText="first name"
          />
          <FormRow
            type="text"
            name="lastName"
            labelText="last name"
            value={lastName}
            handleChange={handleChange}
          />
          <FormRow
            type="email"
            name="email"
            value={email}
            handleChange={handleChange}
          />
          <FormRow
            type="text"
            name="location"
            value={location}
            handleChange={handleChange}
          />
          <FormRow
            type="tel"
            name="phone"
            labelText="phone number"
            value={phone}
            handleChange={handleChange}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
