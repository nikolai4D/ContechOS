import navigateTo from "./navigateTo.js";

export default async function handleToken(tkn) {
  console.log("handleToken", `${tkn}`);

  let getHeaders = {
    "Content-Type": "application/json",
    authorization: tkn,
  };
  console.log("getHeaders", getHeaders);

  try {
    const responseVerifyToken = await fetch("/api/verify", {
      method: "GET",
      headers: getHeaders,
    });

    console.log("getHeaders", getHeaders);

    console.log("responseVerifyToken", await responseVerifyToken.ok);

    //AccessToken is FALSE
    if ((await responseVerifyToken.ok) !== true) {
      console.log("AccessToken is FALSE", `${await responseVerifyToken.ok}`);

      //Clear sessionStorage (accessToken) and set jwt cookie (refreshToken) to expire in the past
      sessionStorage.clear();
      navigateTo("/login");
      //location.reload();
    } else {
      console.log("AccessToken is TRUE", `${await responseVerifyToken.ok}`);

      //AccessToken is TRUE, use RefreshToken to get new accessToken
      try {
        let responseRefreshToken = await fetch("/api/refresh", {
          method: "GET",
        });

        // console.log(
        //   "Set new accessToken",
        //   `${(await responseRefreshToken.json()).accessToken}`
        // );

        //Set new accessToken
        let tokenNew = `Bearer ${
          (await responseRefreshToken.json()).accessToken
        }`;
        console.log("TEST");
        console.log("OLD AT", window.sessionStorage.getItem("accessToken"));
        window.sessionStorage.setItem("accessToken", tokenNew);
        console.log("NEW AT", window.sessionStorage.getItem("accessToken"));
      } catch (err) {
        console.log("error 53");
      }
    }
  } catch (err) {
    console.log("error 57");
  }
}
