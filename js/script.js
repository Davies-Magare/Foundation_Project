$(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var textToShuffle = decodeURIComponent(urlParams.get('text'));
  var sentenceArray = textToShuffle.split(/(?<=[?.!:])/).filter(Boolean).map(s => s.trim());

  function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  // Clear previous content
  $('#wordList').empty();
  $('#dropArea').empty(); // Ensure drop area is also cleared

  var index = 1;
  var wordIndexes = [];

  sentenceArray.forEach(function (sentence) {
    //var newSentence = sentence.trim() + '.';
    var $sentenceDiv = $(`<ul class="sentences" id="${sentenceArray.indexOf(sentence)}"></ul>`);
    
    // Split the sentence into words and create <li> elements
    var wordsArray = sentence.split(" ");
    var $wordDivs = wordsArray.map(function (word) {
      word = word.trim();
	
      if (word !== '.' && word !== '?' && word !== '!') {
        var $dropDiv = $(`<div class="drop-area" data-correct="${word}" id="drop-${index}"></div>`);
        var $newWordDiv = $(`<li class="words" data-word="${word}" id="word-${index}">${word}</li>`);
        
        $('#dropArea').append($dropDiv);
        wordIndexes.push(word);
        index += 1;

        return $newWordDiv;
      }
    }).filter(Boolean); // Remove undefined entries due to punctuation

    // Shuffle the <li> elements
    var shuffledWordDivs = fisherYatesShuffle($wordDivs.slice()); // Copy and shuffle

    // Append shuffled <li> elements to <ul>
    $sentenceDiv.empty();
    shuffledWordDivs.forEach(function ($wordDiv) {
      $sentenceDiv.append($wordDiv); // Use .append() to add elements
    });

    $('#wordList').append($sentenceDiv);
  });

  $('.words').draggable({
    revert: 'invalid'
  });

  $('.drop-area').droppable({
    accept: '.words',
    drop: function(event, ui) {
      var droppableId = $(this).attr('id').split('-')[1];
      var draggableId = ui.draggable.attr('id').split('-')[1];
      var wordText = ui.draggable.text();
      var wordCorrect = $(this).data('correct');

      if (wordText === wordCorrect) {
        $(this).text(wordText);
        $(this).addClass('correct');
        ui.draggable.remove();
        wordIndexes.shift(); // Remove the first element (next word hint)

        // Check if #wordList is empty after removing the word
        if ($('#wordList').find('.words').length === 0) {
		  $('#dropArea').css('border', '2px solid green');
          $('#wordList').css('display', 'none'); // Hide #wordList if empty
		  $('#hint').css('display', 'none'); //Hide the hint button
		  $('#tryAgain').removeClass('hidden');
		  $('#tryAgain').addClass('buttons');
		  $('#tryAgain').on('click', function() {
			  window.location.href = 'user-input.html';
		  });
        }

      } else {
        // Revert draggable to original position
        ui.draggable.animate({
          top: "0px",
          left: "0px"
        }, 'slow');
      }
    }
  });

  $('#hint').on('click', function () {
	$('.debug').append(wordIndexes[0]);
    $('li').removeClass('word-hint');
    $(`.words[data-word='${wordIndexes[0]}']`).addClass('word-hint');
  });
  $('.debug').empty();
  // Clear the textarea
  $('.user-text').val('');
});
