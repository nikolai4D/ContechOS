import navigateTo from "./navigateTo.js";

export default async function auth(email, pwd, code) {
  try {
    const responseAuth = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, pwd, code }),
    });

    if (!responseAuth.ok) {
      if (responseAuth.status === 409) {
        navigateTo("/login");
        return alert("Registration not ok");
      }
      throw new Error(`${responseAuth.status} ${responseAuth.statusText}`);
    }

    navigateTo("/login");
  } catch (err) {
    console.log("error");
  }
}
