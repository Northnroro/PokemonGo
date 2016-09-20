navigator.serviceWorker.register('https://rawgit.com/Northnroro/PokemonGo/master/sw.js');
Notification.requestPermission(function(result) {
	if (result === 'granted') {
		navigator.serviceWorker.ready.then(function(registration) {
			registration.showNotification('Notification with ServiceWorker');
		});
	}
});