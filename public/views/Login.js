export default class Login {
    constructor() {
        document.title = "Login";
    }

    async getTemplate() {
        return `
        <div class="h-100 row align-items-center">
            <div class="container">
                <div class="row">
                    <div class="col">
                    </div>
                    <div class="col">
                        <i class="fas fa-user-astronaut justify-content-center" style="display: flex; text-align:center; font-size:30px; color:#0b5ed7; margin-top:50px; margin-bottom:50px"></i>
                        <form id="login-form" >
                            <div class="mb-3  justify-content-center" style="display: flex;">
                                <input type="text" class="form-control" name="email" aria-describedby="emailHelp" style="width: 300px;">
                            </div>
                            <div class="mb-3 justify-content-center" style="display: flex;">
                                <input type="password" class="form-control" name="pwd" style="width: 300px;">
                            </div>
                            <div class="justify-content-center" style="display: flex;" >
                                <button type="button" class="btn btn-primary" data-link="/login">Login</button>
                            </div>
                        </form>
                    </div>
                    <div class="col">
                    </div>
                </div>
            </div>
        </div>

        `;
    }
}
