let Logout = async () => {
  let result = await fetch(`http://localhost:3000/api/auth/logout`,
    {
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    })

  console.log(await result.json())
  localStorage.removeItem('userId')
  localStorage.removeItem('token')
  window.location.hash = '#/login'
}

export default Logout