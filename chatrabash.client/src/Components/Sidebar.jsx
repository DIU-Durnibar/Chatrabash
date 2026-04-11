import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  console.log(localStorage.getItem("user"));
  
  let role = "";
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role; 
  }

  console.log("Current User Role:", role);

  return (
    <nav>
      {role === "SuperAdmin" && (
        <Link to="/home/all-hostels">Platform Analytics</Link>
      )}
      {/* ম্যানেজার হলে এই মেনু দেখবে */}
    {role === "Manager" && (
      <>
        <Link to="/home/Pending-users">Pending Boarders</Link>
        <Link to="/home/create-room">Add New Room</Link>
        <Link to="/home/rooms">My Inventory</Link>
      </>
    )}
    </nav>
  );
};

export default Sidebar;







