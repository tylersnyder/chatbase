var users = new Firebase(firebaseURL + '/users');

var Login = function () {
  auth.login('google', {
    rememberMe: true,
    preferRedirect: true

  });
}

var Logout = function () {
  auth.logout();
  chat.destroy();
}

$('.button.login').click(Login);
$('.button.logout').click(Logout);

var auth = new FirebaseSimpleLogin(users, function (error, user) {
  if (error) {
    console.log(error);
  }

  else if (user) {
    $('.button.login').addClass('hide');
    $('.button.logout').removeClass('hide');

    chat = new chat(user);
    chat.init();
  }

  else {
    $('.button.login').removeClass('hide');
    $('.button.logout').addClass('hide');
  }
});
