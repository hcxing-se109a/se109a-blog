const Navbar = () => {
  return `<nav>
    ${
      localStorage.getItem("token") !== null
        ? `<a href="#/">Home</a><a class="user-name">${localStorage.getItem(
            "userName"
          )}</a><a href="#/logout">Logout</a>`
        : `<a href="#/">Home</a><a href="#/login">Login</a><a href="#/signup">Signup</a>`
    }
    </nav>`;
};

export default Navbar;
