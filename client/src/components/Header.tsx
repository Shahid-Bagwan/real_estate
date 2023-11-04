import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const usp = new URLSearchParams(window.location.search);
    usp.set("searchTerm", searchTerm);
    const searchQuery = usp.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const usp = new URLSearchParams(location.search);
    setSearchTerm(usp.get("searchTerm") || "");
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex flex-wrap">
            <span className="text-slate-500">Shahid</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSearch}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Find.."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            name=""
            id=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="text-slate-600 hidden sm:inline hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-600 hidden sm:inline hover:underline">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            {currentUser ? (
              <Link to="/profile">
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.profilePic}
                  alt="profile pic"
                />
              </Link>
            ) : (
              <li className=" sm:inline text-slate-600 hover:underline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
