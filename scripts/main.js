
var myHeading = document.querySelector('h1');
//myHeading.innerHTML = 'Hello world!';
var myButton = document.querySelector('button');

document.querySelector('img').onclick = function() {
    alert('Ouch! Stop poking me!');
}

var myImage = document.querySelector('img');

myImage.onclick = function() {
    var mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/one_01.jpg') {
      myImage.setAttribute ('src','images/one_02.jpg');
    } else {
      myImage.setAttribute ('src','images/one_01.jpg');
    }
}

function setUserName() {
  var myName = prompt('Please enter your name.');
  localStorage.setItem('name', myName);
  myHeading.innerHTML = myName + '\'s '+ 'Eight Puzzle !';
}

if(!localStorage.getItem('name')) {
  setUserName();
} else {
  var storedName = localStorage.getItem('name');
  myHeading.innerHTML = storedName + '\'s ' + 'Eight Puzzle !';
}

myButton.onclick = function() {
  setUserName();
}



var log = console.log.bind(console);
var canvas = document.getElementById('puzzle');
log(canvas);
var context = canvas.getContext('2d');

var x = 160;
var y = 160;

var imageFromPath = function(path) {
  var img = new Image();
  img.src = path;
  return img;
}


var boardSize = document.getElementById('puzzle').width;
var tileCount = 3;
var tileSize = boardSize / tileCount ;
var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;
var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;
var solved = false;


var boardParts = new Object;
var Pos = new Array(tileCount*tileCount);
var finalPos = new Array(1, 2, 3, 4, 5, 6, 7, 8, 0);
function setPos() {
  Pos[0] = new Object;
  Pos[0].x = 2; Pos[0].y = 2;
  var cnt=0;
  for(var i = 0; i<tileCount; ++i) {
    for(var j = 0; j<tileCount; ++j) {
      if(i!=tileCount-1||j!=tileCount-1) {
          Pos[++cnt] = new Object;
          Pos[cnt].x = i; Pos[cnt].y = j;
        }
    }
  }
}
function setInitArr(initArr) {
  while(initArr.length<9) {
    var aa = Math.floor(Math.random()*9);
    var flag=true;
    for(var i = 0; i < initArr.length; i++) {
      if(initArr[i]==aa) {
        flag = false;
        break;
      }
    }
    if(flag) {
      initArr.push(aa);
      if(aa==0) {
        emptyLoc.x = Math.floor((initArr.length-1) / 3);
        emptyLoc.y = Math.floor((initArr.length-1) % 3);
        log(emptyLoc.x, emptyLoc.y);
      }
    }
    if(initArr.length == 9) {
      var num=0;
      for(var i=0; i<initArr.length; ++i)
        for(var j=i+1; j<initArr.length; ++j)
          if(initArr[i] > initArr[j] && initArr[j]!=0) num++;
      if(num % 2 == 0) success = true;
      else initArr.splice(0, initArr.length);
    }
  }

}
//called in serBoard;
function setBoard() {
  var initArr = [];
  setInitArr(initArr);
  console.log(initArr);
  boardParts = new Array(tileCount);

  for(var i = 0; i < tileCount; ++i) {
    boardParts[i] = new Array(tileCount);
    for(var j = 0; j < tileCount; ++j) {
      boardParts[i][j] = initArr[i*3+j];
    }
  }

  solved = false;
}
setPos();
setBoard();

var oneImg = imageFromPath('images/one.jpg');
function drawTiles() {
  context.clearRect (0, 0, boardSize, boardSize );

  for(var i = 0; i < tileCount; ++i) {
    for(var j = 0; j < tileCount; ++j) {
      var x = Pos[boardParts[i][j]].x;
      var y = Pos[boardParts[i][j]].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved==true ) {
        context.drawImage(oneImg, y * tileSize,
          x * tileSize, tileSize, tileSize,
          j * tileSize, i * tileSize, tileSize, tileSize);
      }
      //log(x,y);
    }
  }
}
oneImg.addEventListener('load', drawTiles, false);

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
function slideTile(sLoc, tLoc) {
  if(!solved) {
    var t = boardParts[sLoc.x][sLoc.y];
    boardParts[sLoc.x][sLoc.y] = boardParts[tLoc.x][tLoc.y];
    boardParts[tLoc.x][tLoc.y] = t;
    emptyLoc.x = tLoc.x;
    emptyLoc.y = tLoc.y;
  }
  checkSolved();
}
function checkSolved() {
  var flag = true;
  for(var i = 0; i<tileCount; ++i) {
    for(var j = 0; j<tileCount; ++j) {
      if(boardParts[i][j] != finalPos[i*3+j] )
        flag = false;
    }
  }
  solved = flag;
}

canvas.onmousemove = function(e) {
  clickLoc.y = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  clickLoc.x = Math.floor((e.pageY - this.offsetTop) / tileSize);
  //exchange original x and y;
  //log(clickLoc.x, clickLoc.y);
}
canvas.onclick = function() {
  //log(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y);
  if(distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }
  if(solved) {
    setTimeout( function() {
      alert("You solved it!");
    }, 500 );
  }
}


//imgs[2].onload = function() {
//  context.drawImage(imgs[2],x,y);
//}

var jigsaw = function(){
  var image1 = imgs[0];
  var o = {
    image: image1,
    x: x1,
    y: y1,
  }
  return o;
}


window.addEventListener('keydown', function(event) {
  log(event);
  var k = event.key;
  if(k == 'ArrowRight') {
    x += 192;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imgs[2],x,y);
  } else if (k == 'ArrowLeft') {
    x -= 192;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imgs[2],x,y);
  }
})
