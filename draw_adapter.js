'use strict';

var $ = require('jquery');

/**
 * Provide an arbitrary visualization from a given context
 * @return {object}
 */
module.exports = function() {

  var DrawAdapter = function(rootElement) {
    this.rootElement = rootElement;
  };

  // returns an animations function to change
  DrawAdapter.prototype.draw = function(subject, text) {

    var subjectDiv = this.getSubjectDiv(subject);

    var textDiv = $('<div class="text"></div>');
    textDiv.append('<span> ' + text + '.</span>');

    subjectDiv.append(textDiv);
    if($('#'+ subject + ' .text').length > 1){
      textDiv.animate({flexGrow: 1});
    } else {
      textDiv.css({flexGrow: 1});
    }

    // delay in seconds
    var animateFunction = function(color, delay) {
      setTimeout(function(){
        textDiv.css({background: color});
      }, delay * 1000);
    }

    // TODO improve this logic
    var destroyFunction = function(delay){ // delay in seconds

      setTimeout(function(){
        if(subjectDiv.find('.text').length == 1) {
          DrawAdapter.animateDefault(subjectDiv, subjectDiv.remove.bind(subjectDiv))
          .promise().always(function(){
            textDiv.remove()
          });
        } else {
          DrawAdapter.animateDefault(textDiv, textDiv.remove.bind(textDiv));
        }

      }, delay * 1000);
    }

    return {
      animate: animateFunction,
      destroy: destroyFunction
    }
  }

  DrawAdapter.animateDefault = function(element, callback) {
    element.css({transition: 'initial'});
    return element.animate({flexGrow: 0}, 500, 'swing', function(){
      if (callback) {
        callback();
      }
    });
  }

  DrawAdapter.prototype.getSubjectDiv = function(subject) {
    var subjectDiv = $('#' + subject);

    if (subjectDiv.length == 0) {
      subjectDiv = $('<div class="subject" id="' + subject + '"></div>');
      subjectDiv.append('<span> ' + subject + '</span>');
      $(this.rootElement).append(subjectDiv);
    }
    subjectDiv.stop().animate({flexGrow: 1}); // all for the beauty of the world

    return subjectDiv;
  }

  return DrawAdapter;
}();
