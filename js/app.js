
// OCA.TimeManager = {
// 	init: function() {
// 		$.get(OC.generateUrl('/apps/timemanager/api/items'))
// 			.success(function(clients){
// 				var $clientListElement = $('#client-list');
// 				_.each(clients, function(client){
// 					OCA.TimeManager.prependItem($clientListElement, client);
// 				});
// 			});
// 	},

// 	prependItem: function($element, client) {
// 		var element = $('<div>')
// 			.append($('<h3>').text(client.name))
// 			.append($('<p>').text(client.note))
// 			.data('id', client.uuid);
// 		$element.prepend(element);
// 	},

// 	add: function(name, note) {
// 		$.post(
// 			OC.generateUrl('/apps/timemanager/api/items'),
// 			{ name: name, note: note }
// 		).success(function(client){
// 			var $clientListElement = $('#client-list');
// 			OCA.TimeManager.prependItem($clientListElement, client);
// 		});
// 	}
// };

// $(document).ready(function() {
// 	var $newItem = $('#new-item'),
// 		$nameInput = $newItem.find('input[type="text"]'),
// 		$noteInput = $newItem.find('textarea');
// 	$newItem.find('input[type="submit"]').on('click', function() {
// 		var name = $nameInput.val(),
// 			note = $noteInput.val();

// 		// reset values
// 		$nameInput.val('');
// 		$noteInput.val('');

// 		OCA.TimeManager.add(name, note);
// 	});
// 	OCA.TimeManager.init();
// });