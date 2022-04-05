//<-- -->*/
function handleCreateClick(){
    $.ajax({
      url: "/create",
      type: "POST",
      data: {identifier:$("#identifier").val(),name:$("#name").val()},
      success: function(data){
          if (data.error)
            alert("bad create");
          else
            alert("good create");
        } ,
      dataType: "json"
    });
return false;
}

function handleReadClick(){
    $.ajax({
      url: "/read",
      type: "GET",
      data: {identifier:$("#identifier").val()},
      success: function(data){
          if (data.error){
            alert("bad read");
          } else {
            alert("good read");
            $("#name").val(data.name);
            $("#grade").val(data.grade);

          }
        } ,
      dataType: "json"
    });
return false;
}

function handleUpdateClick(){
    $.ajax({
      url: "/update",
      type: "PUT",
      data: {identifier:$("#identifier").val(),name:$("#name").val()},
      success: function(data){
          if (data.error)
            alert("bad update");
          else
            alert("good update");
        } ,
      dataType: "json"
    });
return false;
}

function handleDeleteClick(){
    $.ajax({
      url: "/delete/" + $("#identifier").val(),
      type: "DELETE",
      success: function(data){
          if (data.error)
            alert("bad delete");
          else
            alert("good delete");
        } ,
      dataType: "json"
    });
return false;
}

$(document).ready(function(){
  $("#create").click(handleCreateClick);
  $("#read").click(handleReadClick);
  $("#update").click(handleUpdateClick);
  $("#delete").click(handleDeleteClick);

});
