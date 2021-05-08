function getPosts(tags) {
	return $.ajax({
		async: false,
		url: "https://e621.net/posts.json?limit=100&tags=" + tags + "&_client=Cummies/1.0%20(by%20zaszthecroc)",
		dataType: "json"
	});
}
function delay(wait) {
	return new Promise( resolve => {
		var to = setTimeout(resolve, wait*1000);
		$('#next').on('click', function() {
			clearTimeout(to);
			resolve();
		});
	});
}
async function loadImage(src, link, target, wait) {
	$(target + " img").remove();
	$(target + " a").remove();
	
	var image = document.createElement("img");
	image.src = src;
	image.className = 'e621img';
	
	$(target).append(image);
	$(target + " img").wrap("<a id='imglink' class='e621img' target='_blank' rel='noopener noreferrer' href='" + link + "'>");

	await delay(wait);
}
function updateInfo(id, time) {
	var str = Math.ceil(id % 100 / 10);
		
	if (str < 3) { str = "very light" } else
	if (str < 5) { str = "light" } else
	if (str < 7) { str = "medium" } else
	if (str < 9) { str = "hard" } else
	if (str < 11) { str = "very hard" }
	
	var freq = Math.floor(id % 5) + 2;

	$('#e621id').html('strength: ' + str);
	$('#time').html('time: ' + time + ' s');
	$('#freq').html('strokes: ' + freq + ' per second');	
}
function getTimeDiff() {
	var ss = new Date().getSeconds();
	return timeDiff = 60 - ss;
}
function showTimer(ss) {
var x = setInterval(function() {
	$('#time').html('Time to start: ' + (ss - 3));

	ss--;
	if (ss < 2) {
		clearInterval(x);
		$('#time').html('');
	}
}, 1000);
}
async function processImages(posts) {
	var id, url, len, link, skip;
	
	if ($('#timer').is(':checked')) {
		console.log("lol");
		showTimer(getTimeDiff());
		await delay(getTimeDiff()) 
	}
	$('#timestart').remove();
	for (var post of posts) {
		
		id = post.id;
		url = post.file;
		score = post.score;
		link = "https://e621.net/post/show/" + id;
		
		len = (id % 10 + 3) * 10;

		updateInfo(id, len);
		
		if (skip == true) {
			skip = false;
			continue;
		}
		await loadImage(url, link, '#img', len);
	}
}
$(function() {
	$('#submit').on('click', function() {
		var id = parseInt($('#idtextbox').val(), 10);
		var tags = $('#tagtextbox').val();
	
		var e621id = ~~(id / 100);
		var score = id % 100;

		$('#text').animate()
		getPosts("order:id " + tags + " score:>" + score + " id:>" + e621id).then(function(posts) {
			processImages(posts["posts"]);
		});
	});
});
