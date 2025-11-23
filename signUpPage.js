let userName = document.querySelector("#userName")
let firstName = document.querySelector("#firstName")
let lastName = document.querySelector("#lastName")
let email = document.querySelector("#email")
let password = document.querySelector("#password")
let cPassword = document.querySelector("#cPassword")

document.querySelector("#agreeJoinBtn").addEventListener('click', function () {

    const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || []

    if (!userName.value || !firstName.value || !lastName.value || !email.value || !password.value || !cPassword.value) {
         alert("All Fields are Required!")
         return
    }

    if (password.value != cPassword.value) {
         alert("Please fill the correct Password.")
         return
    }
    if (password.value.length < 8) return alert("Password Must Be 8 Character")


let userNameAlreadyExist = false
for (let i = 0; i < allUsersData.length; i++) {
    if (allUsersData[i].userName == userName.value) {
        userNameAlreadyExist = true
        break
    }
}

if (userNameAlreadyExist) {
    alert("This User Name is Already Taken. Please Try Another!")
    return  // Yahan se function exit ho jayega
}


let emailAlreadyExist = false
for (let i = 0; i < allUsersData.length; i++) {
    if (allUsersData[i].email == email.value) {
        emailAlreadyExist = true
        break
    }
}

if (emailAlreadyExist) {
    alert("This Email is Already Exist. Please Try To Login!")
    return  
}


    const userDetails = {
        userName: userName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
    }
    allUsersData.push(userDetails)
    localStorage.setItem('allUsersData', JSON.stringify(allUsersData))

    window.location = 'jobpage.html'

})


