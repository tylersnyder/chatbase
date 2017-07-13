var auth = Firebase.auth();
var google = new firebase.auth.GoogleAuthProvider();

Login = function () {
  auth.signInWithPopup(google).then(result => {
    var { user } = result

    $('.button.login').addClass('hide');
    $('.button.logout').removeClass('hide');

    chat = new chat(user);
    chat.init();
  })
}

var Logout = function () {
  auth.signOut();
  chat.destroy();

  $('.button.login').removeClass('hide');
  $('.button.logout').addClass('hide');
}

$('.button.login').click(Login);
$('.button.logout').click(Logout);
