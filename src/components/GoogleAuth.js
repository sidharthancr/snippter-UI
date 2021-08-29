import React, { useState } from "react";
import { useGoogleLogin } from "react-google-login";

// refresh token
import { refreshTokenSetup } from "../utils/refreshToken";

const clientId =
  "3306354262-290buf5n6lj0d7bggl13pceeg2iee9c3.apps.googleusercontent.com";

const GoogleAuth = () => {
  const [isLoading, setLoading] = useState(false);

  const [snippets, setSnippets] = useState([]);
  const onSuccess = async (res) => {
    setLoading(true);
    try {
      const response = await postData("processSnippets", res);
      setSnippets(response.snippets);
      console.log("Login Success: currentUser:", res);

      setLoading(false);
      refreshTokenSetup(res);
    } catch (error) {
      alert("Error while getting snippets");
      setLoading(false);
    }
  };

  async function postData(url = "processSnippets", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    alert(`Failed to login.😢`);
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: "offline",
    scope: "https://www.googleapis.com/auth/gmail.readonly",
  });

  return (
    <div>
      <button onClick={signIn} className="button" disabled={isLoading}>
        <span className="buttonText">
          {isLoading
            ? "Please wait, fetching duplicate snippets.."
            : "Analyze my emails"}
        </span>
      </button>
      {snippets.length > 0 && <h4>Possible Duplicate Snippets</h4>}
      {snippets.length > 0 &&
        snippets.map((x, index) => (
          <>
            <div>
              {index + 1} : {x}
            </div>
            <br />
          </>
        ))}
      {!isLoading && snippets.length === 0 && <h4>No Snippets</h4>}
      <div></div>
    </div>
  );
};

export default GoogleAuth;
