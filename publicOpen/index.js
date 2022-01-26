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

            if(!response.ok) {
                if (response.status === 401) {
                    return await sendRefreshToken();
                }
                throw new Error(`${response.status} ${response.statusText}`)
            }
            return await response.json()

            // token = `Bearer ${(await response.json()).accessToken}`
            // let link = await fetch('http://localhost:3000/app', {
            //     method: 'GET',
            //     headers: { 'authorization' : token }
            // })

            // return link

        } catch (err) {
            console.log(err.stack);
            displayErr()
        }
    }
    auth()

    const sendRefreshToken = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/refresh', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'},
                credentials: 'include'
            });
        } catch (err) {
            console.log(err.stack);
            displayErr()
        }
    }


});

