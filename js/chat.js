var count = 0,
    chatbox = $('.chat .chat-box'),
    date = new Date(),
    d = date.toDateString(),
    t = date.toLocaleTimeString(),
    timestamp = new Date().getUTCMilliseconds();

var messages = new Firebase(firebaseURL + '/chat/messages');
var chat = function(user) {
  count = 0;

  this.init = function() {
    $('.chat').removeClass('hide');
    chat.get();
    chat.open();

    window.setInterval(function() {
      chat.get();
    }, 1000);
  }

  this.open = function() {
    $('#chat-message').focus();
    chat.scroll('to-bottom');
    chat.form('show');
  }

  this.close = function() {
    chat.form('hide');
  }

  this.get = function() {
    messages.on('value', function(snapshot) {
  	  if (count == 0 | Object.size(snapshot.val()) > count) {
    	  chatbox.empty();
    		count = 0;
        var prev = '';

        $.each(snapshot.val(), function() {
          count++;

          var timestamp = $(this).get(0).timestamp,
              message = $(this).get(0).message.replace(/[<&>'"]/g, function(c) {
                 return "&#" + c.charCodeAt() + ";";
              }),
              username = $(this).get(0).user,
              self = user.displayName;

          message = message.replace(':emoji-start:', '<div class="');
          message = message.replace(':emoji-end:', '"></div>');

          if (self == username) {
            var name = '<span class="user" data-self="true">' + username + '</span>';
          } else {
            var name = '<span class="user"">' + username + '</span>';
          }

          if (count != 0 && username == prev) {
            name = '';
          }

          if (self == username) {
            chatbox.append(name+'<div class="message" data-self="true" data-timestamp title="' + timestamp + '">' + message + '</div>' );
          } else {
            chatbox.append(name+'<div class="message" data-timestamp title="' + timestamp + '">' + message + '</div>');
          }

          prev = username;
        })

        var ping = new Audio('iphone-sms.mp3');
        ping.play();
        chat.scroll('to-bottom');
      }
    })
  }

  this.send = function() {
    var message = $('#chat-message').val();

    messages.push({
      'date': d,
      'timestamp': t,
      'user': user.displayName,
      'message': message
    })

    chat.spinner('sent');
  }

  this.bind = function(selector, data) {
    if ($(selector).is(':input')) {
      $(selector).val(data);
    } else {
      $(selector).text(data);
    }
  }

  this.form = function(action) {
    switch (action) {
      case 'show':
        $('.chat .form').removeClass('hide');
        chat.trigger('hide');
        break;

      case 'hide':
        $('.chat .form').addClass('hide');

        window.setTimeout(function() {
          chat.trigger('show');
        }, 1000);
        break;

      case 'reset':
        $('.chat .form :input').val('');
        break;

      default:
        return;
    }
  }

  this.trigger = function(action) {
    if (action == 'show') {
      $('[data-chat=open]').removeClass('hide');
    }

    else if (action == 'hide') {
      $('[data-chat=open]').addClass('hide');
    }
  }

  this.spinner = function(action, text) {
    switch (action) {
      case 'show':
        chat.scroll('disable');
        $('.loading .message').text(text);
        $('.loading').removeClass('hide');
        break;

      case 'hide':
        chat.scroll('enable');
        $('.loading').addClass('hide');
        break;

      case 'sent':
        chat.spinner('show');
        $('input').attr('disabled', true);
        window.setTimeout(function() {
          chat.spinner('hide');
          chat.form('reset');
          $('input').removeAttr('disabled').focus();
        }, 500);
        break;

      default:
        return;
    }
  }

  this.scroll = function(action) {
    switch (action) {
      case 'disable':
        $('body').addClass('open');
        break;

      case 'enable':
        $('body').removeClass('open');
        break;

      case 'to-bottom':
        chatbox.animate({
          scrollTop: chatbox[0].scrollHeight
        }, 1000);
        break;

      default:
        return;
    }
  }

  this.destroy = function() {
    $('.chat').remove();
  }

  function insertEmoji(emoji) {
    var classes = $(emoji).attr('class');
    messages.push({
      'date': d,
      'timestamp': t,
      'user': user.displayName,
      'message': ':emoji-start:'+ classes + ':emoji-end:'
    })

    chat.spinner('sent');
  }

  $('.emoji-box .emoji').click(function() {
    insertEmoji(this);
  })
}

$('[data-chat=send]').click(function (e) {
  e.preventDefault();
  if ($('.chat form').h5Validate('allValid') === true) {
    chat.send();
  }
});
