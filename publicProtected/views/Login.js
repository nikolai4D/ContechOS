
export default class Login {
    
    constructor() {
        document.title = "Login";
    }

    async getTemplate() {
        return `
        <div class="container">
            <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" required><br><br>
            <input type="password" name="password" placeholder="Password" required><br><br>
            <input type="submit" value="login">
            </form>
        </div>
        `
    }
}




