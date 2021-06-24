console.log("Hello from index.js!");

document.addEventListener("DOMContentLoaded", async() => {

    const res = await fetch("http://localhost:8080/tweets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "TWITTER_LITE_ACCESS_TOKEN"
        )}`,
      },
    });
    console.log(res);

    if(res.status === 401) {
      window.location.href = '/'
      return;
    } else if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }

    const { tweets } = await res.json();
    console.log(tweets)

    const tweetsContainer = document.querySelector("#tweetsContainer");
    const tweetsHtml = tweets.map(
        ({ message }) => `
        <div class="card>
            <div class="card-body">
                <p class="card-text">${message}</p>
            </div>
        </div>
    `
    );

    tweetsContainer.innerHTML = tweetsHtml.join("");

});
