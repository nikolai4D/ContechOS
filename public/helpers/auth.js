import navigateTo from "./navigateTo.js";

export default async function auth(email, pwd) {
  try {
    const responseAuth = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, pwd }),
    });

    if (!responseAuth.ok) {
      if (responseAuth.status === 401) {
        return alert("Not ok");
      }
      throw new Error(`${responseAuth.status} ${responseAuth.statusText}`);
    }

    const token = `Bearer ${(await responseAuth.json()).accessToken}`;
    sessionStorage.setItem("accessToken", await token);

    navigateTo("/");
  } catch (err) {
    console.log("error");
  }
}
