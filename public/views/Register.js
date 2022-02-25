export default class Login {
  constructor() {
    document.title = "Register";
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
                        <form id="register-form" >
                            <div class="mb-3  justify-content-center" style="display: flex;">
                                <input type="text" class="form-control" name="email" aria-describedby="emailHelp" placeholder="email" style="width: 300px;">
                            </div>
                            <div class="mb-3 justify-content-center" style="display: flex;">
                                <input type="password" class="form-control" name="pwd" placeholder="password" style="width: 300px;">
                            </div>
                            <div class="mb-3 justify-content-center" style="display: flex;">
                                <input type="code" class="form-control" name="code" placeholder="code" style="width: 300px;">
                            </div>
                            <div class="justify-content-center" style="display: flex;" >
                                <button type="button" class="btn btn-secondary" data-function="/register">Register</button>
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
