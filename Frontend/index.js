document.addEventListener("DOMContentLoaded", init)

function init(){
  console.log('%c loaded', 'color: magenta');
  getAllShoes().then(addShoesToSideBar)
  getOneShoe(1).then(showShoeDetailOnDOM)
}

function addShoesToSideBar(shoesArray){
const shoeList = document.querySelector(".list-group")
shoesArray.forEach(shoe => {
  const shoeLi = document.createElement("li")
  shoeLi.setAttribute("data-id", shoe.id)
  shoeLi.innerText = shoe.name
  shoeList.append(shoeLi)
  shoeLi.addEventListener("click", getShoeDetail)
  })
}

function getShoeDetail(event){
  getOneShoe(event.target.dataset.id).then(showShoeDetailOnDOM)
}

function showShoeDetailOnDOM(shoe){
  const shoeCard = document.querySelector("#main-shoe")
  shoeCard.innerHTML = `<img class="card-img-top" id="shoe-image" src=${shoe.image}>
  <div class="card-body">
    <h4 class="card-title" id="shoe-name">Style: ${shoe.name}</h4>
    <p class="card-text" id="shoe-description">Description: ${shoe.description}</p>
    <p class="card-text"><small class="text-muted" id="shoe-price">Price: $${shoe.price}</small></p>
  <div class="container" id="form-container">
    <form id="new-review" data-id=${shoe.id}>
      <div class="form-group">
        <textarea placeholder ="write your review here" class="form-control" id="review-content" rows="3"></textarea>
        <input type="submit" class="btn btn-primary"></input>
      </div>
    </form>
  </div>
</div>
<h5 class="card-header">Reviews</h5>
<ul class="list-group list-group-flush" id="reviews-list">
</ul>`
  shoe.reviews.forEach(review => {
  let reviewLi = document.createElement("li")
  let reviewList = document.querySelector("#reviews-list")
  reviewLi.setAttribute("class", "list-group-item")
  reviewLi.innerText = review.content
  reviewList.append(reviewLi)
  })

  const reviewForm = shoeCard.querySelector("#new-review")
  reviewForm.addEventListener("submit", getReviewInfo)
}

function getReviewInfo(event){
  event.preventDefault()
  const shoeID = event.target.dataset.id;
  const newReview = event.target.querySelector("#review-content").value
  postAReview(shoeID, newReview).then(addReviewsToList)
}

function addReviewsToList(review){
  let reviewLi = document.createElement("li")
  let reviewList = document.querySelector("#reviews-list")
  reviewLi.setAttribute("class", "list-group-item")
  reviewLi.innerText = review.content
  reviewList.prepend(reviewLi)
}


// fetches
const shoeURL = 'http://localhost:3000/shoes'

function getAllShoes(){
  return fetch(shoeURL)
    .then(response => response.json())
}

function getOneShoe(id){
  return fetch(shoeURL + `/${id}`)
    .then(response => response.json())
}

function postAReview(shoeID, newReview) {
  const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
        },
        body: JSON.stringify({content: newReview})
    }
    return fetch(shoeURL + `/${shoeID}/reviews`, options)
    .then(response => response.json())
}
