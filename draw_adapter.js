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

        DrawAdapter.animateDefault(textDiv, DrawAdapter.remove(textDiv, function(){

          if(subjectDiv.find('.text').length == 0) {
            DrawAdapter.animateDefault(subjectDiv, DrawAdapter.remove(subjectDiv));
          }
        }));

      }, delay * 1000);
    }

    return {
      animate: animateFunction,
      destroy: destroyFunction
    }
  }

  DrawAdapter.remove = function(element, callback) {
    return function(){
      element.remove();
      if(callback) {
        callback();
      }
    }
  }

  DrawAdapter.animateDefault = function(element, callback) {
    element.css({transition: 'initial'});
    element.animate({flexGrow: 0, height: 0}, 500, 'swing', function(){
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

      subjectDiv.animate({flexGrow: 1}); // all for the beauty of the world
    }

    return subjectDiv;
  }

  return DrawAdapter;
}();
