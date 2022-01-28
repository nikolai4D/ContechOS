
export default class Login {
    
    constructor() {
        document.title = "Login";
    }

    async getTemplate() {
        return `
        <div class="container">
            <form id="login-form">
                <input type="text" name="email" placeholder="Email" required><br><br>
                <input type="password" name="pwd" placeholder="Password" required><br><br>
                <input type="submit" data-link="/login">
            </form>
        </div>
        `
    }
}




