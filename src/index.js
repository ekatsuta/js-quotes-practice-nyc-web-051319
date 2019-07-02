// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", ()=>{

  const quotesContainer = document.querySelector("#quote-list")
  const quoteForm = document.querySelector("#new-quote-form")
  const newQuoteInput = document.querySelector("#new-quote")
  const newAuthorInput = document.querySelector("#author")
  const toggle = document.querySelector(".slider")

  toggle.addEventListener('click', (e) => {
    if (!e.target.previousElementSibling.checked) {
      fetch("http://localhost:3000/quotes?_embed=likes")
      .then(resp => resp.json())
      .then(json => {
        const sorted_json = json.sort(function(a,b) {
          if (a.author < b.author) {
            return -1
          } else if (a.author > b.author) {
            return 1
          } else {
            return 0
          }
        })
        quotesContainer.innerHTML = null
        sorted_json.forEach(quote => {
          quotesContainer.innerHTML += `
          <li class='quote-card' id = "${quote.id}">
            <blockquote class="blockquote">
              <p class="mb-0">${quote.quote}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span>0</span></button>
              <button class='btn-danger'>Delete</button>
              <button class='btn-edit'>Edit</button>

            <div class="edit-container">
            <form class="edit-quote" style="">
              <h3>Edit</h3>

              <input type="text" name="quote" value="${quote.quote}" placeholder="Edit Quote" class="input-quote">
              <br>
              <input type="text" name="author" value="${quote.author}" placeholder="Edit Author" class="input-author">
              <br>
              <input type="submit" name="submit" value="Edit" class="submit">
            </form>
            </div>

            </blockquote>
          </li>
          `
        }
      )
      })
    } else {
      fetch("http://localhost:3000/quotes?_embed=likes")
      .then(resp => resp.json())
      .then(json => {
        quotesContainer.innerHTML = null
        json.forEach((quote)=> {
          quotesContainer.innerHTML += `
          <li class='quote-card' id = "${quote.id}">
            <blockquote class="blockquote">
              <p class="mb-0">${quote.quote}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span>0</span></button>
              <button class='btn-danger'>Delete</button>
              <button class='btn-edit'>Edit</button>

            <div class="edit-container">
            <form class="edit-quote" style="">
              <h3>Edit</h3>

              <input type="text" name="quote" value="${quote.quote}" placeholder="Edit Quote" class="input-quote">
              <br>
              <input type="text" name="author" value="${quote.author}" placeholder="Edit Author" class="input-author">
              <br>
              <input type="submit" name="submit" value="Edit" class="submit">
            </form>
            </div>

            </blockquote>
          </li>
          `
      })})
    }})



  let editQuote = false;

  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(resp => resp.json())
  .then(json =>
    json.forEach((quote)=> {
      quotesContainer.innerHTML += `
      <li class='quote-card' id = "${quote.id}">
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>0</span></button>
          <button class='btn-danger'>Delete</button>
          <button class='btn-edit'>Edit</button>

        <div class="edit-container">
        <form class="edit-quote" style="">
          <h3>Edit</h3>

          <input type="text" name="quote" value="${quote.quote}" placeholder="Edit Quote" class="input-quote">
          <br>
          <input type="text" name="author" value="${quote.author}" placeholder="Edit Author" class="input-author">
          <br>
          <input type="submit" name="submit" value="Edit" class="submit">
        </form>
        </div>

        </blockquote>
      </li>
      `
    })
  )

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/quotes?_embed=likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Access: "application/json"
      },
      body: JSON.stringify({
        "quote": newQuoteInput.value,
        "author": newAuthorInput.value,
        createdAt: new Date()
      })
    })
    .then(resp => resp.json())
    .then((json) => {
      quotesContainer.innerHTML += `
      <li class='quote-card' id = "${json.id}">
      <blockquote class="blockquote">
      <p class="mb-0">${json.quote}</p>
      <footer class="blockquote-footer">${json.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>0</span></button>
      <button class='btn-danger'>Delete</button>
      <button class='btn-edit'>Edit</button>

      <div class="edit-container">
      <form class="edit-quote" style="">
        <h3>Edit</h3>

        <input type="text" name="quote" value="${json.quote}" placeholder="Edit Quote" class="input-quote">
        <br>
        <input type="text" name="author" value="${json.author}" placeholder="Edit Author" class="input-author">
        <br>
        <input type="submit" name="submit" value="Edit" class="submit">
      </form>
      </div>

      </blockquote>
      </li>
      `
    })

  })

  quotesContainer.addEventListener("click", (e) => {
    if (e.target.className === "btn-danger"){
      // e.preventDefault();
      fetch(`http://localhost:3000/quotes/${e.target.parentElement.parentElement.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Access: "application/json"
        },
        body: JSON.stringify({
          "id": e.target.parentElement.parentElement.id
        })
      })
      .then(resp => resp.json())
      .then(json =>
        e.target.parentElement.parentElement.remove()
      )
    } else if (e.target.className === "btn-success") {
      fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Access: "application/json"
        },
        body: JSON.stringify({
          "quoteId": parseInt(e.target.parentElement.parentElement.id)
        })
      })
      .then(resp => resp.json())
      .then(json =>
        e.target.querySelector("span").innerText ++
      )

    } else if (e.target.className === "btn-edit") {
      editQuote = !editQuote
      const quoteCard = e.target.parentElement.parentElement
      const editQuoteForm = quoteCard.querySelector(".edit-container")
      const editQuoteInput = quoteCard.querySelector(".input-quote")
      const editAuthorInput = quoteCard.querySelector(".input-author")

      if (editQuote) {

        editQuoteForm.style.display = 'block'
        editQuoteForm.addEventListener('submit', (e) => {
          e.preventDefault()
          fetch(`http://localhost:3000/quotes/${quoteCard.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Access: "application/json"
            },
            body: JSON.stringify({
              "quote": editQuoteInput.value,
              "author": editAuthorInput.value
            })
          })
          .then(resp => resp.json())
          .then(json => {
            console.log(e.target.parentElement)
            e.target.parentElement.parentElement.querySelector(".mb-0").innerText = json.quote;
          })
        })
      } else {
        editQuoteForm.style.display = 'none'
      }
    }
  })




})
