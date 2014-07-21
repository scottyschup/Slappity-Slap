// JavaScript functions for whack-a-friend
totalPoints = 0;
lastIndex = 41;
totalMisses = 0;
msecs = [2200, 3300, 6600, 9900, 13200];
images = [0, 1, 2, 3, 4];
progress = 1;
points = [10, 25, 50, 100, 250];
hitStatus = {}; 
thisCell = {};
timer = [];
level = 1;
handPos = 0;
imgSets = {'testImgs': 'Orignal Test Images', 'repubs': 'Republicans', 'dems': 'Democrats'};

Object.prototype.getKey = function(value) {
  for(var key in this){
    if(this[key] == value){
      return key;
    }
  }
  return null;
}

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
	hand.style.backgroundImage = "url('img/hand/back.png')";
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

function promptImgSet() {
	for (var key in imgSets) {
		if (key != 'getKey') {
			var opt = new Option(imgSets[key], key);
			document.aForm.imgSelect.appendChild(opt);
			for (i = 0; i < 5; i++) {
				var img = document.createElement('img');
				img.src = 'img/' + key + '/' + i + '.png';
				img.height = '1px';
				img.width = '1px';
				document.getElementById('preloader').appendChild(img);
			}		
		}
	}
	setTimeout(function() {document.getElementById('imgSetDiv').style.display = 'block'}, 500);
}

function selectImgSet() {
	var a = document.getElementById('imgSelect');
	imgSet = a.options[a.selectedIndex].value;
	document.getElementById('imgSetDiv').style.display = 'none';
}

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
	timer[timer.length] = setTimeout(function() {imageAppear(1)}, 3300);
	timer[timer.length] = setTimeout(function() {imageAppear(2)}, 6600);
	timer[timer.length] = setTimeout(function() {imageAppear(3)}, 9900);
	timer[timer.length] = setTimeout(function() {imageAppear(4)}, 13200);
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
	hitStatus[n] = 0; // 0 for 'miss', 1 for 'hit'
	var ind = Math.floor(Math.random() * cells.length);
	var index = isEmpty(ind);
 	thisCell[n] = cells[index];
 	cellStatus[cells[index]] = 1;

 	document.getElementById(thisCell[n]).style.backgroundImage = "url('img/" + imgSet + '/' + n + ".png')";
 	timer[timer.length] = setTimeout(function() {
 		if (hitStatus[n] == 0) {
 			miss(thisCell[n]); 
 		}
 	}, msecs[0] - (250 * (Math.log(progress))));

 	if (totalMisses < 10) {
 		timer[timer.length] = setTimeout(function() {
 			imageAppear(n)}, msecs[n] - (250 * (Math.log(progress))));
	} else {
		gameOver();
	}
}

function slap(ev) {
	ev.preventDefault();
	if (handPos == 0) {
		document.getElementById('hand').style.backgroundImage = 'url("img/hand/slap.png")';
		handPos = 1;
	} else {
		document.getElementById('hand').style.backgroundImage = 'url("img/hand/back.png")';
		handPos = 0;
	}
	
	if (cellStatus[ev.target.id] == 1) {
		n = thisCell.getKey(ev.target.id)
		addPoints(ev.target.id, n);
	} 
}

function addPoints(hitCell, n) {
	hitStatus[n] = 1;
	totalPoints += points[n];
	if (Math.floor(totalPoints / 1000) == level) {
		levelUp();
	}

	if (progress <= 100) {
		progress += 1;
	} else {
		progress += 0.5;
	}

	document.getElementById('score').innerHTML = totalPoints + ' points';
	document.getElementById('message').innerHTML = '+' + points[n] + ' points';
	document.getElementById(hitCell).style.backgroundImage = "url('img/hit.png')";
	cellStatus[hitCell] = 2;
	timer[timer.length] = setTimeout(function() {
		document.getElementById(hitCell).style.backgroundImage = "url('')";
		cellStatus[hitCell] = 0;
	}, 500);
}

function levelUp() {
	level += 1;
	totalMisses = 0;
	document.getElementById('level').innerHTML = "Level " + level;
	document.getElementById('misses').innerHTML = totalMisses + " misses";
	document.getElementById('message2').innerHTML = "Level Up!";
	setTimeout(function() {
		document.getElementById('message2').innerHTML = '';
	}, 3000);
}
// function strikes(strikeCell) {
// 	totalStrikes += 1;
// 	document.getElementById("strikes").innerHTML = totalStrikes + ' strikes';
// 	cellStatus[hitCell] = 2;
// 	if (totalStrikes == 3) {
// 		gameOver();
// 	} else {
// 		document.getElementById(strikeCell).style.backgroundImage = "url('img/strike.png')";
// 		timer[timer.length] = setTimeout(function() {
// 			document.getElementById(strikeCell).style.backgroundImage = "url('')";
// 			cellStatus[hitCell] = 0;
// 		}, 500);
// 	}
// }

function miss(missCell) {
	totalMisses += 1;
	if (totalMisses == 11) {
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
	for (i = timer.length - 1; i > 0; i--) {
		clearTimeout(timer[i]);
	}
	for (i = 0; i < cells.length; i++) {
		document.getElementById(cells[i]).style.backgroundImage = "url('')";
		cellStatus[cells[i]] = 0;
	}
	document.getElementById('row2').style.display = 'none';
	document.getElementById('gameOver').style.display = 'block';
	document.getElementById('text').style.display = 'none';
	document.getElementById('hand').style.display = 'none';
	document.body.style.cursor = 'default';
	document.getElementById('reset').style.display = 'block';
}
