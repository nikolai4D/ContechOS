import Actions from "../store/Actions.js";

export default class Dashboard {
  constructor() {
    document.title = "Dashboard";
  }

  getTemplate() {
    Actions.GETALL("props");
    Actions.GETALL("configs");
    Actions.GETALL("datas");

    return `
        <div class="container">
            <h1>Dashboard</h1>
        </div>
        `;
  }
}
