
OCA.TimeManager = {
	init: function() {
		$.get(OC.generateUrl('/apps/timemanager/api/items'))
			.success(function(items){
				var $itemListElement = $('#item-list');
				_.each(items, function(item){
					OCA.TimeManager.prependItem($itemListElement, item);
				});
			});
	},

	prependItem: function($element, item) {
		var element = $('<div>')
			.append($('<h3>').text(item.title))
			.append($('<p>').text(item.text))
			.data('id', item.id);
		$element.prepend(element);
	},

	add: function(title, text) {
		$.post(
			OC.generateUrl('/apps/timemanager/api/items'),
			{ title: title, text: text }
		).success(function(item){
			var $itemListElement = $('#item-list');
			OCA.TimeManager.prependItem($itemListElement, item);
		});
	}
};

$(document).ready(function() {
	var $newItem = $('#new-item'),
		$titleInput = $newItem.find('input[type="text"]'),
		$textInput = $newItem.find('textarea');
	$newItem.find('input[type="submit"]').on('click', function() {
		var title = $titleInput.val(),
			text = $textInput.val();

		// reset values
		$titleInput.val('');
		$textInput.val('');

		OCA.TimeManager.add(title, text);
	});
	OCA.TimeManager.init();
});