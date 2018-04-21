const db = Firebase.database()
const ping = new Audio('iphone-sms.mp3')
const $chatlog = $('.js-chat--log')
const $user = $('.js-chat--user')
const messagesRef = db.ref('chat/messages')

messagesRef.on('value', addInitialMessages)
messagesRef.on('child_added', addNewMessage)

function addNewMessage(snapshot) {
    const message = snapshot.val()
    addMessage(message, {})
}

function addMessage(message, previousMessage) {
    $chatlog.append($createNewMessage(message, previousMessage))
    ping.play()
    scroll('to-bottom')
}

let initialMessagesLoaded = false

function addInitialMessages(snapshot) {
    const messages = snapshot.val()

    if (initialMessagesLoaded || !messages) {
        return false
    }

    const keys = Object.keys(messages).sort()

    keys.map(key => {
        const message = messages[key]
        const currentIndex = keys.indexOf(key)
        const previousMessage = messages[keys[currentIndex - 1]] || {}
        addMessage(message, previousMessage)
    })

    initialMessagesLoaded = true
}

function getLoggedInUser() {
    const user = JSON.parse($user.val())
    return user
}

function isLoggedInUser(user) {
    const loggedInUser = getLoggedInUser() || {}
    return loggedInUser.uid === user.uid
}

function $createNewMessage(message, previousMessage) {
    const text = message.text || message.message
    const sanitized = sanitize(text)
    const emojified = emojify(sanitized)
    const isSelf = isLoggedInUser(message.user)
    const author = message.user.uid !== previousMessage.user.uid
                ? `<span class="user" data-self="${isSelf}">${message.user.displayName}</span>`
                : ''

    let previousMessageUser = message.user.displayName
    return $(`${author}<div class="message" data-self="${isSelf}" data-timestamp title="${message.timestamp}">${emojified}</div>`)
}

function sendMessage(text) {
    const date = new Date()
    const user = getLoggedInUser()

    messagesRef.push({
      date: date.toDateString(),
      timestamp: date.toLocaleTimeString(),
      user,
      text
    })

    spinner('sent')
}

function sanitize(text) {
    return text.replace(/[<&>'"]/g, function(xss) {
        return '&#' + xss.charCodeAt() + ';'
    })
}

function emojify(text) {
    return text
        .replace(':emoji-start:', '<div class="')
        .replace(':emoji-end:', '"></div>')
        .replace(':hyperlink-start:', '<div class="emoji s_link"></div><a href="')
        .replace(':hyperlink-end:', '" target="blank">Hyperlink</a>')
}

function scroll(action) {
    switch (action) {
        case 'disable':
            $('body').addClass('open')
            break

        case 'enable':
            $('body').removeClass('open')
            break

        case 'to-bottom':
            $chatlog.animate({
                scrollTop: $chatlog[0].scrollHeight
            }, 1000)
            break

        default:
            break
    }
}

function spinner(action, text) {
    switch (action) {
      case 'show':
        scroll('disable')
        $('.loading .message').text(text)
        $('.loading').removeClass('hide')
        break

      case 'hide':
        scroll('enable')
        $('.loading').addClass('hide')
        break

      case 'sent':
        spinner('show')
        $('.js-chat--send').attr('disabled', true)
        $('.js-chat--text').val('')

        setTimeout(function() {
          spinner('hide')
          $('.js-chat--send').removeAttr('disabled')
        }, 500)
        break

      default: return
    }
  }

//   function insertEmoji(emoji) {
//     var classes = $(emoji).attr('class'),
//         message = $('#chat-message').val()

//     if (classes.indexOf('s_link') > -1) {
//       if (message.toLowerCase().indexOf('http') > -1) {
//         console.log('sending message')
//         messages.push({
//           'date': d,
//           'timestamp': t,
//           'user': user.displayName,
//           'message': ':hyperlink-start:'+ message + ':hyperlink-end:'
//         })

//         chat.spinner('sent')
//       } else {
//         $('span.error').text('Please enter a URL').removeClass('hide')
//         $('#chat-message').addClass('error').focus()
//       }
//     } else {
//       messages.push({
//         'date': d,
//         'timestamp': t,
//         'user': user.displayName,
//         'message': ':emoji-start:'+ classes + ':emoji-end:'
//       })

//       chat.spinner('sent')
//     }
//   }

//   $('.emoji-box .emoji').click(function() {
//     insertEmoji(this)
//   })

$('.js-chat--send').click(function (e) {
    e.preventDefault()

    const text = $('.js-chat--text').val()

    if (text) {
        sendMessage(text)
    }
})