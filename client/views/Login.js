const App = document.querySelector('#app')

let view = (
  `
  <div class="login">
  <form class="form">
      <h2>登入</h2>
      <span class="msg"></span>
      <div class="group">
          <label for="user_id">Email</label>
          <input type="email" name="email" id="user_id" required>
      </div>
      <div class="group">
          <label for="user_password">密碼</label>
          <input type="password" name="password" id="user_password" required>
      </div>
      <div class="btn-group">
          <button class="btn">登入</button>
      </div>
      <br><a href="#/signup">註冊</a>
  </form>
</div>
 `
)

let feedBack = (message) => {
  let msgSpan = document.querySelector('.msg')
  msgSpan.innerText = message
  console.log(message)
}

let Login = async () => {
  App.innerHTML = view

  let loginForm = document.querySelector('.form')

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    let userEmail = event.target.email.value,
      userPwd = event.target.password.value;

    let res = await fetch(`http://localhost:3000/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: userEmail,
        password: userPwd
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    let resJson = await res.json()
    if (res.status !== 200) {
      let errorMessage = await res.text()
      feedBack(errorMessage)
    } else {
      let userId = resJson.data.userId
      let name = resJson.data.name
      let token = resJson.data.token
      localStorage.setItem('userId', userId)
      localStorage.setItem("userName", name)
      localStorage.setItem('token', token)

      // Server 端的 JWT token 時效為一小時，Client 端也要設定
      const remainingMilliseconds = 3600 * 1000
      const expiryDate = new Date(
        new Date().getTime() + remainingMilliseconds
      );
      setTimeout(() => {
        window.location.hash = '#/logout'
      }, remainingMilliseconds)

      localStorage.setItem('expiryDate', expiryDate.toISOString())

      window.location.hash = '#/home'
    }

  })
}

export default Login