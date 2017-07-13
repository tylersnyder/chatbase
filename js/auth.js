var auth = Firebase.auth();
var google = new firebase.auth.GoogleAuthProvider();

Login = function () {
  auth.signInWithPopup(google).then(result => {
    var { user } = result

    $('.button.login').addClass('hide');
    $('.button.logout').removeClass('hide');

    chat = new chat(user);
    chat.init();
    // emailLoginEvent(user);
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
