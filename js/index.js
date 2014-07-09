try {
  Typekit.load();
} catch(e) { }

var firebaseURL = 'https://torid-fire-3356.firebaseio.com';

$.h5Validate.addPatterns({
  date: /^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$/,
  phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})/,
  email: /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/,
  zip: /^\d{5}$/
})

$('.chat .form').h5Validate();

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
