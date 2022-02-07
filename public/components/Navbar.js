export default class Navbar {
  cconstructor() { }

  async getTemplate() {
    return `
    <div id="navbar">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" data-link="/">ContechOS</a>
      <div class="navbar">
        <ul class="navbar-nav me-auto" style="flex-direction:row;   justify-content: space-between;column-gap: 25px;">
          <li class="nav-item">
            <a class="nav-link" href="#" data-link="/props">Props</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" data-link="/configs">Config</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" data-link="/datas">Data</a>
          </li>
        </ul>
        <form class="d-flex justify-content-end" style="margin-left:1.5em;">
          <button class="btn btn-outline-secondary" type="button" data-link="/logout">Logout</button>
        </form>
      </div>
    </div>
  </nav>
    </div>
        `;
  }
}
