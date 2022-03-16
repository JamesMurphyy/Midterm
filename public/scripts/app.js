// Client facing scripts here
$(() => {

  // Get the modal
  let modal = document.getElementById("myModal");

  // Get the image and insert it inside the modal - use its "alt" text as a caption

  let img = document.getElementsByClassName("item_img");
  let modalImg = document.getElementById("img01");
  let captionText = document.getElementById("caption");
  let favouritesForm = document.getElementById("AddToFavourites");

  console.log('img =>', img);
  // each clickable
  $(img).click((event) => {
    modal.style.display = "block";
    modalImg.src = event.target.src;
    captionText.innerHTML = event.target.alt;
    favouritesForm.setAttribute("action", `/favourites/${event.target.id}`)
    console.log("testtyy111", captionText, event);
  });

  // Get the <span> element that closes the modal

  let span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal

  span.onclick = function () {
    console.log("testtyy2222");
    modal.style.display = "none";
  };

});
