export default class Navbar {
  cconstructor() { }

  async getTemplate() {
    return `
    <div id="navbar">
    <nav class="navbar navbar-expand navbar-light bg-light">
    <div class="container-fluid">
  
      <a class="navbar-brand" href="#" data-link="/"> <i class="bi bi-server" style="margin-right:7px;"></i>contechOS</a>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav me-auto navbar-nav-scroll" style="--bs-scroll-height: 100px;">
          <li class="nav-item">
            <a class="nav-link" href="#" data-link="/props">Props</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" data-link="/configs">Config</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" data-link="/datas">Data</a>
          </li>
          <li class="nav-item">
          <a class="nav-link" href="#" data-link="/apis">API</a>
          </li>
        </ul>
        <form class="d-flex">
          <button class="btn btn-outline-secondary" type="button" data-link="/logout">Logout</button>
        </form>
      </div>
    </div>
  </nav>
    </div>
        `;
  }
}
