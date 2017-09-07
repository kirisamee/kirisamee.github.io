var log = console.log.bind(console);
var myHeading = document.querySelector('h1');
//myHeading.innerHTML = 'Hello world!';
var myButton = document.getElementById('ch_u');
var algo_button = document.getElementById('algo');
var start_button = document.getElementById('start');
var cover = document.getElementById('descDiv');
log(cover);
function setUserName() {
  var myName = prompt('Please enter your name.');
  localStorage.setItem('name', myName);
  myHeading.innerHTML = myName + '\'s '+ 'Eight Puzzle !';
}

if(!localStorage.getItem('name')) {
  setUserName();
}
else {
  var storedName = localStorage.getItem('name');
  myHeading.innerHTML = storedName + '\'s ' + 'Eight Puzzle !';
}

var startFlag = 0;//have not repaired
var algo_go = 0;
myButton.onclick = function() {
  setUserName();
}
algo_button.onclick = function() {
  if(algo_go==0&&startFlag==1) {
    set_algo();
    algo_go = 1;
  }
}
start_button.onclick = function() {
   start();
   cover.style.display = 'none';
 }
function set_algo() {
  search();
}

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
    for(var i = 0; i < initArr.length; ++i) {
      if(initArr[i]==aa) {
        flag = false;  break;
      }
    }
    if(flag) {
      initArr.push(aa);
      if(aa==0) {
        emptyLoc.x = Math.floor((initArr.length-1) / 3);
        emptyLoc.y = Math.floor((initArr.length-1) % 3);
        //log(emptyLoc.x, emptyLoc.y);
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

setBoard();
setPos();
var oneImg = imageFromPath('images/one.jpg');
var drawTiles = function() {
  context.clearRect (0, 0, boardSize, boardSize );
  for(var i = 0; i < tileCount; ++i) {
    for(var j = 0; j < tileCount; ++j) {
      var x = Pos[boardParts[i][j]].x;
      var y = Pos[boardParts[i][j]].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved==true ) {
        context.drawImage(oneImg, y * tileSize,
          x * tileSize, tileSize, tileSize,
          j * tileSize, i * tileSize, tileSize, tileSize);//(image,s,d)
      }
    }
  }
}
var draw_entire_photo = function() {
  oneImg.addEventListener('load', function() {
    context.drawImage(oneImg, 0 ,0);
  }, false);
}
draw_entire_photo();
var startFlag = 0;
function start() {
  if(startFlag==0) {
    setBoard();
    //oneImg.addEventListener('load', drawTiles, false);
    drawTiles();
    startFlag=1;
  }
}
//setBoard();

//drawTiles();



function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
//called in slideTile;
function swap(sLoc, tLoc) {
  log(sLoc,tLoc);
  var t = boardParts[sLoc.x][sLoc.y];
  boardParts[sLoc.x][sLoc.y] = boardParts[tLoc.x][tLoc.y];
  boardParts[tLoc.x][tLoc.y] = t;
  emptyLoc.x = tLoc.x;
  emptyLoc.y = tLoc.y;
}
//called in slideTile
function checkSolved(k) {
  var flag = true;
  for(var i = 0; i<tileCount; ++i) {
    for(var j = 0; j<tileCount; ++j) {
      if(boardParts[i][j] != finalPos[i*3+j] )
        flag = false;
    }
  }
  solved = flag;
  if(solved) {
    startFlag = 0;
    algo_go = 0;
  }
}


function slideTile(sLoc, tLoc) {
  if(!solved) {
    swap(sLoc, tLoc);
  }
  checkSolved();
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
      cover.style.display = 'block';
    }, 500 );
  }
}
