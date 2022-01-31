export default class Login {
  constructor() {
    document.title = "Login";
  }

  async getTemplate() {
    return `
    <div class="container">
        <div class="row">
            <div class="col">
            </div>
            <div class="col">
            <i class="fas fa-user-astronaut" style="text-align:center; font-size:30px; color:#0b5ed7; margin-top:50px; margin-bottom:50px"></i>
                <form id="login-form">
                    <div class="mb-3">
                        <input type="text" class="form-control" name="email" aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" name="pwd">
                    </div>
                    <button type="button" class="btn btn-primary" data-link="/login">Login</button>
                </form>
            </div>
            <div class="col">
            </div>
    </div>
        `;
  }
}
