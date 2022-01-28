import router from "./router.js";

export default function navigateTo(url) {
  console.log("navigateTo", `${url}`);
  history.pushState(null, null, url);
  router();
}
