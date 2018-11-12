function getPosts(tags) {
	return $.ajax({
		async: false,
		url: "https://e621.net/post/index.json?limit=100&tags=" + tags,
		dataType: "jsonp"
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

	console.log(src);
	$(target + " img").remove();
	$(target + " a").remove();
	
	var image = document.createElement("img");
	image.src = src;
	image.className = 'e621img';
	
	$(target).append(image);
	$(target + " img").wrap("<a id='imglink' class='e621img' target='_blank' rel='noopener noreferrer' href='" + link + "'>");


	await delay(wait);

}
function_lock = false;
function updateInfo(id, time) {
	console.log(id);
	console.log(time);
	
	var str = Math.ceil(id % 100 / 10);
	
	if (str < 3) { str = "very light" } else
	if (str < 5) { str = "light" } else
	if (str < 7) { str = "medium" } else
	if (str < 9) { str = "hard" } else
	if (str < 11) { str = "very hard" }
	
	
	$('#e621id').html('strength: ' + str);
	$('#time').html('time: ' + time + ' s');

	
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
		url = post.file_url;
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

		
		console.log(e621id);
		console.log(score);
		

		$('#text').animate()
		getPosts(tags + " score:>" + score + " order:id id:>" + e621id).then(function(posts) {
			processImages(posts);
		});
	
	});
});
