//JavaScript functions for whack-a-friend
totalPoints = 0;
lastIndex = 41;
totalStrikes = 0;
totalMisses = 0;
msecs = 2000;
progress = 1;

function getMouseCoords(e) {
	var e = e || window.event;
	// document.getElementById('testArea').innerHTML = e.clientX + ', ' + e.clientY;
}

var followCursor = (function() {
	var hand = document.createElement('div');
	hand.style.position = 'absolute';
	hand.style.margin = '0';
	hand.style.padding = '40px';
	hand.style.border = '0';
	hand.style.backgroundImage = "url('img/hand_back.png')";
	hand.id = 'hand'
	return {
		init: function() {
			document.body.appendChild(hand);
		},
		run: function(e) {
			var e = e || window.event;
			hand.style.left  = (e.clientX + 2) + 'px';
			hand.style.top = (e.clientY - 30) + 'px';
			// getMouseCoords(e);
		}
	};
}());

function start() {
	followCursor.init();
	document.body.onmousemove = followCursor.run;
	document.body.style.cursor = 'crosshair';
	document.getElementById('start').style.display = 'none';
	document.getElementById('text').innerHTML = 'Happy Slapping!';
	imageAppear();
}

function imageAppear() {
	thisTarget = 'miss';
	var cells = document.getElementsByClassName("divCell");
	var index = Math.floor(Math.random() * cells.length);

 	if (index == lastIndex) {
 		if (index < cells.length - 1) {
 			index += 1;
 		} else {
 			index -= 1;
 		}
 	}
 	thisCell = cells[index];
 	lastIndex = index;
 	document.getElementById(thisCell.id).style.backgroundImage = "url('img/1square.png')";
 	setTimeout(function() {
 		if (thisTarget == 'miss') {
 			miss(thisCell);
 		} else if (thisTarget == 'strike') {
 			document.getElementById(thisCell.id).style.backgroundImage = "url('')";
 		}
 	}, msecs - (250 * (Math.log(progress))) - 50);

 	if (totalStrikes < 3 && totalMisses < 10) {
 		setTimeout(function() {
 			imageAppear()}, msecs - (250 * (Math.log(progress))));
	} else {
		gameOver();
	}
}

function slap(ev) {
	ev.preventDefault();
	document.getElementById('hand').style.backgroundImage = 'url("img/hand_slap.png")';
	setTimeout(function() {document.getElementById('hand').style.backgroundImage = 'url("img/hand_back.png")'}, 250);
	if (thisTarget != 'hit') {
		if (document.getElementById(ev.target.id) == thisCell) {
			addPoints(ev.target);
		} else {
			strikes(ev.target);
		}
	}
}

function addPoints(hitCell) {
	thisTarget = 'hit';
	totalPoints += 10;
	progress += 1;
	document.getElementById("score").innerHTML = totalPoints + ' points';
	document.getElementById(hitCell.id).style.backgroundImage = "url('img/hit.png')";
	setTimeout(function() {
		document.getElementById(hitCell.id).style.backgroundImage = "url('')";
	}, 500);
}

function strikes(strikeCell) {
	thisTarget = 'strike';
	totalStrikes += 1;
	document.getElementById("strikes").innerHTML = totalStrikes + ' strikes';
	if (totalStrikes == 3) {
		gameOver();
	} else {
		document.getElementById(strikeCell.id).style.backgroundImage = "url('img/strike.png')";
		setTimeout(function() {
			document.getElementById(strikeCell.id).style.backgroundImage = "url('')";
		}, 500);
	}
}

function miss(missCell) {
	totalMisses += 1;
	if (totalMisses == 11 || totalStrikes == 3) {
		gameOver();
	} else {
		document.getElementById('misses').innerHTML = totalMisses + ' misses';
		document.getElementById(missCell.id).style.backgroundImage = "url('img/miss.png')";
		setTimeout(function() {
			document.getElementById(missCell.id).style.backgroundImage = "url('')";
		}, 500);
	}
}

function gameOver() {
	document.getElementById('row2').style.display = 'none';
	document.getElementById('gameOver').style.display = 'block';
	document.getElementById('hand').style.display = 'none';
	document.getElementById(thisCell.id).style.backgroundImage = "url('')";
	document.body.style.cursor = 'default';
	document.getElementById('reset').style.display = 'block';
}
