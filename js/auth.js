var auth = Firebase.auth()
var google = new firebase.auth.GoogleAuthProvider()

auth.onAuthStateChanged((result) => {
  receiveUser(result)
})

function receiveUser(user) {
  $('.chat').removeClass('hide')
  $('.button.login').addClass('hide')
  $('.button.logout').removeClass('hide')
  $('.js-chat--user').val(JSON.stringify(user))

  // chat = new chat(user)
  // chat.init()
}

function login() {
  auth.signInWithPopup(google)
    .then(function(result) {
      receiveUser(result.user)
    })
}

function logout() {
  auth.signOut()
  chat.destroy()

  $('.button.login').removeClass('hide')
  $('.button.logout').addClass('hide')
}

$('.button.login').click(login)
$('.button.logout').click(logout)
