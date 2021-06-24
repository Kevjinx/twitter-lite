const signupForm = document.querySelector('.sign-up-form')

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm)
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const body = { email, password, username };

  try {
    const res = await fetch("http://localhost:8080/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw res;
    }

    const {
      token,
      user: { id },
    } = await res.json();

    localStorage.setItem("TWITTER_LITE_ACCESS_TOKEN", token);
    localStorage.setItem("TWITTER_LITE_CURRENT_USER_ID", id);
    // redirect to home page to see all tweets:
    window.location.href = "/";


  } catch (err) {

    if (err.status >= 400 && err.status < 600) {
      const errorJSON = await err.json();
      const errorsContainer = document.querySelector(".errors-container");
      // TODO: Generate and render errors
      let errorsHtml = [
        `
          <div class="alert alert-danger">
              Something went wrong. Please try again.
          </div>
        `,
      ]

      const { errors } = errorJSON;

      if (errors && Array.isArray(errors)) {
        errorsHtml = errors.map(
          (message) => `
          <div class="alert alert-danger">
              ${message}
          </div>
        `
        );
        // TODO: Join errorsHtml and set the errorsContainer.innerHTML
        errorsContainer.innerHTML = errorsHtml.join('')
        // TODO: Error rendering
      }

    } else {
      // TODO: Alert user about bad internet connection
      alert(
        "Something went wrong. Please check your internet connection and try again!"
      );
    }
  }

})
