import Graph from "../components/Graph.js";
import Actions from "../store/Actions.js";

export default class Datas {
  constructor() {
    document.title = "Data";
  }

  async getTemplate() {
    const view = "datas";
    await Actions.GETALL(view);
    return Graph(view);
  }
}
