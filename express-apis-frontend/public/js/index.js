console.log("Hello from index.js!");

document.addEventListener("DOMContentLoaded", async() => {

    const res = await fetch("http://localhost:8080/tweets");
    console.log(res);

    if(res.status === 401) {
        res.redirect('/')
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
