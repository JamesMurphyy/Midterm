
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
    favouritesForm.setAttribute("action", `/favourites/${event.target.id}`);
  });

  // Get the <span> element that closes the modal

  let span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal

  span.onclick = function () {
    console.log("testtyy2222");
    modal.style.display = "none";
  };
});

$(function () {
  let socket = io();
  $('.msg-text').submit(function (e) {
    let timeNow = new Date().toLocaleString();
    e.preventDefault();
    socket.emit('chat message', { msg: $('#msg').val(), author: window.author });
    $('.message').append(`<div class="message-row you-message">
              <div class="message-title">
                🚙 <span>${window.author}</span>
              </div>
              <div class="message-text">
                ${$('#msg').val()}
              </div>
              <div class="message-time">
                ${timeNow}
              </div>`);
    $('#msg').val('');
    return false;
  });

  socket.on('new message', function (msg) {
    let timeNow = new Date().toLocaleString();
    $('.message').append(`<div class="message-row other-message">
          <div class="message-title">
            🚗 <span> ${msg.author} </span>
          </div>
          <div class="message-text">
            ${msg.msg}
              </div>
          <div class="message-time">
            ${timeNow}
              </div>
        </div>`);
    return false;
  });

  // click event linking to message the seller
  $('.message-owner').click(function () {
    const owner_id = $(this).attr("id");
    const roomName = `room${owner_id}`;
    window.location.replace("http://localhost:8080/message");
    socket.emit('room', { room: roomName });
  });
});
