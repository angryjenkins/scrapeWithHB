
$(document).on('click', 'li', function(){

  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);

      if(data.note){
        $('#title-' + thisId).val(data.note.title); // <-- fixed typO here
        $('#note-'+ thisId).val(data.note.body);
      }
    });

    return false;
});

$(document).on('click', '.submit', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#title-' + thisId).val(),//$('#titleinput').val(), <-- Changed
      body:  $('#note-' + thisId).val(), //$('#bodyinput').val(), <-- Changed
      date: Date.now
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });


  $('#title-' + thisId).val("");
  $('#note-' + thisId).val("");

  return false;
});