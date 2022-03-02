import Actions from "../store/Actions.js";

export default class Dashboard {
  constructor() {
    document.title = "Dashboard";
  }

  async getTemplate() {
    await Actions.GETALL("props");
    await Actions.GETALL("configs");
    await Actions.GETALL("datas");
    return `
        <div class="container">
            <h1>Dashboard</h1>
        </div>
        `;
  }
}
