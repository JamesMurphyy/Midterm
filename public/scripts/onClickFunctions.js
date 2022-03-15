
$(document).ready(() =>{
  // $('#removeButton').on('click', function(ctl) {
  //   console.log("Pressed")
  //   $(ctl).parents("tr").remove();
  // }
  // $.ajax({
  //   url: '/script.cgi',
  //   type: 'DELETE',
  //   success: function(result) {
  //       // Do something with the result
  //   }

function makeDELETErequest() {
  $.ajax({
      url: 'test.html',
      type: 'DELETE',
      success: function (result) {
          // Do something with the result
      }
  });
}

});

