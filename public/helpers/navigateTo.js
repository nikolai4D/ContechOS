import router from "./router.js";

export default function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}
