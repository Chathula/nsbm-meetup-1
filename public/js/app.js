$(document).ready(function () {
  $('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
  var cfrm = confirm('Are You Sure?');
  var that = this;

  if (cfrm) {
    var id = $(this).data('id');
    $.ajax({
      type: 'DELETE',
      url: '/users/' + id,
      dataType: 'json'
    }).done(function (response) {
      if (response.success) {
        $(that).parent('li').remove();
      }
    });

  } else {
    return false;
  }
}
