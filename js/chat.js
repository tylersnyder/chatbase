var count = 0,
    chatbox = $('.chat .chat-box'),
    date = new Date(),
    d = date.toDateString(),
    t = date.toLocaleTimeString(),
    timestamp = new Date().getUTCMilliseconds(),
    messages = new Firebase(firebaseURL + '/chat/messages'),
    allValid = $('.chat .form').h5Validate('allValid');

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
              username = $(this).get(0).user,
              self = user.displayName,
              message = $(this).get(0).message.replace(/[<&>'"]/g, function(c) {
                 return "&#" + c.charCodeAt() + ";";
              });

          message = message.replace(':emoji-start:', '<div class="');
          message = message.replace(':emoji-end:', '"></div>');
          message = message.replace(':hyperlink-start:', '<div class="emoji s_link"></div><a href="');
          message = message.replace(':hyperlink-end:', '" target="blank">Hyperlink</a>');

          var name = (self == username) ? '<span class="user" data-self="true">' + username + '</span>' : '<span class="user">' + username + '</span>';

          if (count != 0 && username == prev) {
            name = '';
          }

          (self == username) ? chatbox.append(name + '<div class="message" data-self="true" data-timestamp title="' + timestamp + '">' + message + '</div>' ) : chatbox.append(name + '<div class="message" data-timestamp title="' + timestamp + '">' + message + '</div>');

          prev = username;
        })

        var ping = new Audio('iphone-sms.mp3');
        ping.play();
        chat.scroll('to-bottom');
      }
    })
  }

  this.send = function(x) {
    var message = $('#chat-message').val();

    messages.push({
      'date': d,
      'timestamp': t,
      'user': user.displayName,
      'message': message
    })

    chat.spinner('sent');
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

      default: return;
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
        $('.chat .button').attr('disabled', true);
        chat.form('reset');
        window.setTimeout(function() {
          chat.spinner('hide');
          $('.chat .button').removeAttr('disabled');
        }, 500);
        break;

      default: return;
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

      default: return;
    }
  }

  this.bind = function(selector, data) {
    if ($(selector).is(':input')) {
      $(selector).val(data);
    } else {
      $(selector).text(data);
    }
  }

  this.destroy = function() {
    $('.chat').remove();
  }

  function insertEmoji(emoji) {
    var classes = $(emoji).attr('class'),
        message = $('#chat-message').val();

    if (classes.indexOf('s_link') > -1) {
      if (message.toLowerCase().indexOf('http') > -1) {
        console.log('sending message');
        messages.push({
          'date': d,
          'timestamp': t,
          'user': user.displayName,
          'message': ':hyperlink-start:'+ message + ':hyperlink-end:'
        })

        chat.spinner('sent');
      } else {
        $('span.error').text('Please enter a URL').removeClass('hide');
        $('#chat-message').addClass('error').focus();
      }
    } else {
      messages.push({
        'date': d,
        'timestamp': t,
        'user': user.displayName,
        'message': ':emoji-start:'+ classes + ':emoji-end:'
      })

      chat.spinner('sent');
    }
  }

  $('.emoji-box .emoji').click(function() {
    insertEmoji(this);
  })

  $('[data-chat=send]').click(function (e) {
    e.preventDefault();
    if ($('.chat form').h5Validate('allValid') === true) {
      chat.send();
    }
  });
}
