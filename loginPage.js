console.log("hi")

const emailLogin = document.querySelector("#emailLogin")
const passwordLogin = document.querySelector("#passwordLogin")

document.querySelector("#loginBtn").addEventListener('click', function () {
    console.log("click hoa")

    const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || []

    if (!emailLogin.value || !passwordLogin.value) return alert("All Fileds Are Requird!")

    if (passwordLogin.value.length < 8) return alert("Password Must Be 8 Character")

    let isExist = allUsersData.find(function (userData) {
        return userData.email == emailLogin.value
    })

    if (!isExist) return alert("Please Create Your Account!")

    if (isExist.password == passwordLogin.value) {
        alert("Congratulation,You are LogIn")
        window.location = 'jobpage.html'
    } else {
        alert("Incorrect Password.")
    }
})


