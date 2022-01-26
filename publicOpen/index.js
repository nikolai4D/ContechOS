let token;

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const pwd = loginForm.password.value;

    const auth = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ email, pwd})
            });

            token = `Bearer ${(await response.json()).accessToken}`

            return await fetch('http://localhost:3000/app', {
                method: 'POST',
                headers: { 'authorization' : token }
            })

        } catch (err) {
            console.log("err")
        }
    }
    auth()


});

