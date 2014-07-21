// JavaScript functions for whack-a-friend
totalPoints = 0;
lastIndex = 41;
totalStrikes = 0;
totalMisses = 0;
msecs = [2000, 3300, 5500, 7700, 9900]
progress = 1;
images = ['scott', 'kevin', 'heather', 'quigs'];
points = [10, 25, 50, 100, 250];
thisTarget = {}; 
thisCell = {};
timer = [];

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
	divCells = document.getElementsByClassName("divCell");
	cells = [];
	for (i = 0; i < divCells.length; i++) {
		cells[i] = divCells[i].id;
	}
	
	cellStatus = {};
	for (i = 0; i < cells.length; i++) {
		cellStatus[cells[i]] = 0;
	}
	followCursor.init();
	document.body.onmousemove = followCursor.run;
	document.body.style.cursor = 'crosshair';
	document.getElementById('start').style.display = 'none';
	document.getElementById('text').innerHTML = 'Happy Slapping!';
	imageAppear(0);
	timer[timer.length] = setTimeout(function() {imageAppear(1)}, 5000);
	timer[timer.length] = setTimeout(function() {imageAppear(2)}, 9000);
	timer[timer.length] = setTimeout(function() {imageAppear(3)}, 15000);
}

function isEmpty(i) {
	while (cellStatus[cells[i]] != 0) {
		if (i < cells.length - 1) {
			i += 1;
		} else {
			i = 0;
		}
	}
	return i;
}

function imageAppear(n) {
	thisTarget[n] = 'miss';
	var ind = Math.floor(Math.random() * cells.length);
	var index = isEmpty(ind);
 	thisCell[n] = cells[index];
 	cellStatus[cells[index]] = 1;

 	document.getElementById(thisCell[n]).style.backgroundImage = "url('img/" + images[n] + ".png')";
 	timer[timer.length] = setTimeout(function() {
 		if (thisTarget[n] == 'miss') {
 			miss(thisCell[n]); 
 		}
 	}, msecs[0] - (250 * (Math.log(progress))));

 	if (totalStrikes < 3 && totalMisses < 10) {
 		timer[timer.length] = setTimeout(function() {
 			imageAppear(n)}, msecs[n] - (250 * (Math.log(progress))));
	} else {
		gameOver();
	}
}

Object.prototype.getKey = function(value) {
  for(var key in this){
    if(this[key] == value){
      return key;
    }
  }
  return null;
}

function slap(ev) {
	ev.preventDefault();
	document.getElementById('hand').style.backgroundImage = 'url("img/hand_slap.png")';
	setTimeout(function() {document.getElementById('hand').style.backgroundImage = 'url("img/hand_back.png")'}, 200);

	if (cellStatus[ev.target.id] == 1) {
		n = thisCell.getKey(ev.target.id)
		addPoints(ev.target.id, n);
	} else {
		strikes(ev.target.id);
	}

}

function addPoints(hitCell, n) {
	thisTarget[n] = 'hit';
	totalPoints += points[n];

	if (progress <= 30) {
		progress += 3;
	} else if (progress <= 75) {
		progress += 2;
	} else if (progress >= 135) {
		progress += 0.5;
	} else {
		progress += 1;
	}

	document.getElementById("score").innerHTML = totalPoints + ' points';
	document.getElementById(hitCell).style.backgroundImage = "url('img/hit.png')";
	cellStatus[hitCell] = 2;
	timer[timer.length] = setTimeout(function() {
		document.getElementById(hitCell).style.backgroundImage = "url('')";
		cellStatus[hitCell] = 0;
	}, 500);
}

function strikes(strikeCell) {
	totalStrikes += 1;
	document.getElementById("strikes").innerHTML = totalStrikes + ' strikes';
	cellStatus[hitCell] = 2;
	if (totalStrikes == 3) {
		gameOver();
	} else {
		document.getElementById(strikeCell).style.backgroundImage = "url('img/strike.png')";
		timer[timer.length] = setTimeout(function() {
			document.getElementById(strikeCell).style.backgroundImage = "url('')";
			cellStatus[hitCell] = 0;
		}, 500);
	}
}

function miss(missCell) {
	totalMisses += 1;
	if (totalMisses == 11 || totalStrikes == 3) {
		gameOver();
	} else {
		document.getElementById('misses').innerHTML = totalMisses + ' misses';
		document.getElementById(missCell).style.backgroundImage = "url('img/miss.png')";
		cellStatus[missCell] = 2;
		timer[timer.length] = setTimeout(function() {
			document.getElementById(missCell).style.backgroundImage = "url('')";
			cellStatus[missCell] = 0;
		}, 500);
	}
}

function gameOver() {
	document.getElementById('row2').style.display = 'none';
	document.getElementById('gameOver').style.display = 'block';
	document.getElementById('hand').style.display = 'none';
	for (var i = 0; i < thisCell.length; i++) {
		document.getElementById(thisCell[i]).style.backgroundImage = "url('')";
	}
	document.body.style.cursor = 'default';
	document.getElementById('reset').style.display = 'block';
	for (i = timer.length - 1; i > 0; i--) {
		clearTimeout(timer[i]);
	}
}
