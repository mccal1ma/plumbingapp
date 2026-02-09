import { FaPhone } from "react-icons/fa";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const PhoneLink = ({ phone, label, showIcon = true }) => {
  if (!phone) return label ? <span>{label}</span> : null;

  return (
    <a 
      href={`tel:${phone}`} 
      style={{ 
        color: "var(--primary-500)", 
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem"
      }}
    >
      {showIcon && <FaPhone style={{ fontSize: "0.875rem" }} />}
      {formatPhoneNumber(phone)}
    </a>
  );
};

export default PhoneLink;
