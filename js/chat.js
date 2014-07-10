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
    }, 3000);
  }

  this.open = function() {
    chat.scroll('to-bottom');
    chat.form('show');
  }

  this.close = function() {
    chat.form('hide');
  }


  this.get = function() {
    messages.on('value', function(snapshot) {
      //console.log(snapshot.val());
      //console.log('length: '  + Object.size(snapshot.val()));
	    //console.log('count: ' + count);
	    //console.log(JSON.stringify(snapshot.val()));

  	  if (count == 0 | Object.size(snapshot.val()) > count) {
    	  //console.log('new message');
    	  chatbox.empty();
    		count = 0;
        var prev = '';

        $.each(snapshot.val(), function() {
          count++;

          var timestamp =$(this).get(0).timestamp ,
               text = '<span class="text">' + $(this).get(0).message.replace(/[<&>'"]/g, function(c) {
                 return "&#" + c.charCodeAt() + ";";
              }); + '</span>',
              self = user.displayName;

          console.log(text);
          text = text.replace(':emoji-start:', '<div class="');
          text = text.replace(':emoji-end:', '"></div>');
          console.log(text);

          if (self == $(this).get(0).user) {
            var name = '<span class="user" data-self="true">' + $(this).get(0).user + '</span>';
          } else {
            var name = '<span class="user" data-timestamp title="' + timestamp + '">' + $(this).get(0).user + '</span>';
          }

          if (count != 0 && $(this).get(0).user == prev) {
            name = '';
          }

          if (self == $(this).get(0).user) {
            chatbox.append(name+'<div class="message" data-self="true" data-timestamp title="' + timestamp + '">' + text + '</div>' );
          } else {
            chatbox.append(name+'<div class="message" data-timestamp title="' + timestamp + '">' + text + '</div>');
          }

          prev = $(this).get(0).user;
        })

        var ping = new Audio('iphone-sms.mp3');
        ping.play();
        chat.scroll('to-bottom');
      }
    })
  }

  this.send = function() {
    var message = $('#chat-message').val();

    if (preventInjection(message) == true) {
      messages.push({
        'date': d,
        'timestamp': t,
        'user': user.displayName,
        'message': message
      })

      window.setTimeout(function() {
        chat.form('reset');
      }, 500);
    }
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
    if (action == 'show') {
      chat.scroll('disable');

      $('.loading-feedback .message').text(text);
      $('.loading-feedback').removeClass('hide');
    } else if (action == 'hide') {
      chat.scroll('enable');
      $('.loading').addClass('hide');
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
  }

  $('.emoji-box .emoji').on('click', function() {
    insertEmoji(this);
  })
}

$('[data-chat=send]').click(function (e) {
  e.preventDefault();

  if ($('.chat form').h5Validate('allValid') === true) {
    chat.send();
  }
});

function preventInjection(message) {
  var $trimmed = message.trim().toLowerCase();

  if ($trimmed.indexOf('<script') > -1 || $trimmed.indexOf('script>') > -1) {
    return false;
  } else if ($trimmed.indexOf('type=') > -1 && $trimmed.indexOf('text/javascript') > -1) {
    return false;
  } else {
    return true;
  }
};
