$(function () {
	$('#submit-button').on('click', function(e) {
		e.preventDefault();
		var textToShuffle = $('.user-text').val();
		if (textToShuffle.length) {
		//Redirect to page2.html with input text as query parameter
		window.location.href = 'drag-drop.html?text=' + encodeURIComponent(textToShuffle);
		}
	});
});