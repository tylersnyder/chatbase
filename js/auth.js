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
    emailLoginEvent(user);
  }

  else {
    $('.button.login').removeClass('hide');
    $('.button.logout').addClass('hide');
  }
});

function emailLoginEvent(user) {
  $.ajax({
    type: 'post',
    url: 'http://mandrillapp.com/api/1.0/messages/send.json',
    data: {
      'key': '',
      'message': {
        'from_email': 'auth@chatbasejs.com',
        'to': [
            {
              'email': 'tsnyder@mosscorps.com',
              'name': 'Tyler Snyder',
              'type': 'to'
            }
          ],
        'autotext': 'true',
        'subject': user.displayName + ' has logged in to Chatbase.',
        'html': user.displayName + ' (' + user.email + ') has logged in to Chatbase.'
      }
    }
   })
 }
