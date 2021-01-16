const App = document.querySelector("#app");
import Navbar from "./Navbar.js";

let view = () => {
  return `
  ${Navbar()}
  <div class="signup">
    <form class="form">
      <h2>註冊</h2>
      <span class="msg"></span>
      <div class="group">
        <label for="user_id">Email</label>
        <input type="email" name="email" id="email" required>
      </div>
      <div class="group">
        <label for="user_id">使用者名稱</label>
        <input type="text" name="name" id="name" required>
      </div>
      <div class="group">
        <label for="user_password">密碼</label>
        <input type="password" name="password" id="password" required>
      </div>
      <div class="btn-group">
        <button class="btn">註冊</button>
      </div>
      <br><a href="#/login">登入</a>
    </form>
  </div>
  `;
};

let feedBack = (message) => {
  let msgSpan = document.querySelector(".msg");
  msgSpan.innerText = message;
  console.log(message);
};

let Signup = async () => {
  App.innerHTML = view();
  let signupForm = document.querySelector(".form");
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let userEmail = event.target.email.value,
      userName = event.target.name.value,
      userPwd = event.target.password.value;

    let response = await fetch(`http://localhost:3000/api/auth/signup`, {
      method: "POST",
      body: JSON.stringify({
        email: userEmail,
        name: userName,
        password: userPwd,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 201) {
      let errorMessage = await response.text();
      feedBack(errorMessage);
    } else {
      window.location.hash = "#/login";
    }
  });
};

export default Signup;
