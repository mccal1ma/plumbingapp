const CharacterCounter = ({ current, max }) => {
  const percentage = (current / max) * 100;
  
  const getColor = () => {
    if (percentage <= 70) return "var(--green-dark)";
    if (percentage <= 89) return "#f0ad4e"; // warning yellow
    return "var(--red-dark)";
  };

  return (
    <div style={{ 
      textAlign: "right", 
      fontSize: "0.875rem", 
      color: getColor(),
      fontWeight: percentage > 89 ? "bold" : "normal",
      marginTop: "0.25rem"
    }}>
      {current}/{max}
    </div>
  );
};

export default CharacterCounter;
