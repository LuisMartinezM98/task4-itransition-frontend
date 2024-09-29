import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../../pages/Home";
const Header = () => {
  const [name, setName] = useState("");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      setName(decodedToken.user.name);
    }
  }, []);

  return (
    <header className="text-cyan-600 p-4 flex justify-around items-center">
      <h1 className="text-2xl font-semibold">Task 4</h1>
      <p className="text-xl font-semibold">Hi {name}</p>
      <p
        className="cursor-pointer hover:text-gray-400 transition-colors ease-in-out delay-100 duration-200 underline underline-offset-2"
        onClick={handleLogOut}
      >
        Log out
      </p>
    </header>
  );
};

export default Header;
