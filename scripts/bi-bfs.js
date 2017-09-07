function State() {
  a: new Array(9);
  x: 0;
  y: 0;
}
var k = 0;
var s = new State();
s.a = [];
var set_start = function() {
  for(var i = 0; i<3; ++i) {
    for(var j = 0; j<3; ++j) {
      s.a[i*3+j] = boardParts[i][j];
      if(s.a[i*3+j]==0) {s.x=i;s.y=j;}
    }
  }
}

//log(s, s.a, s.x, s.y);
var e = new State();
e.a = [1,2,3,4,5,6,7,8,0];
e.x = 2; e.y=2;
//log(e);
var log = console.log.bind(console);
var hash = [1,1,2,6,24,120,720,5040,40320];
var vis1 = new Array(400000);
var pre = new Array(400000);
var vis2 = new Array(400000);
var rd = new Array;
var dir = [[-1,0],[1,0],[0,-1],[0,1]];//up down left right

var get_rd1 = function(x) {
  if(pre[x].num==-1) return;
  else {
  //  log(pre[x]);
    get_rd1(pre[x].num);
    rd.push(pre[x].rd);
  }
  // rd starts from zero
}
var get_rd2 = function (x) {
  if(pre[x].num==-1) return;
  //log(pre[x]);
  rd.push(pre[x].rd^1);
  get_rd2(pre[x].num);
}

var get_hash = function (a) {
  var ret=0,k=0;
  for(var i=0; i<9;++i) {
    k=0;
    for(var j=0;j<i;++j) {
      if(a[j]>a[i]) k++;
    }
    ret+=k*hash[i];
  }
  return ret;
}


var bi_bfs = function () {
  //init
  que1 = new Queue();
  que2 = new Queue();
  que1.enqueue(s);
  que2.enqueue(e);
  var u , v; var cnt=0;
  var x,y;
  vis1.fill(0); pre=[]; vis2.fill(0);
  rd = [];
  var h1 = get_hash(s.a);
  var h2 = get_hash(e.a);
  vis1[h1]= 1; vis2[h2] = 2;
  pre[1] = new Object; pre[1].num=-1;
  pre[2]=new Object; pre[2].num=-1;
  var num=2;

  while(!que1.isEmpty() && !que2.isEmpty()) {
    u = que1.dequeue();
    h1 = get_hash(u.a);cnt++;
    //  if(cnt++ == 1000) { log(">1000times");return; }
    if(vis2[h1]) {
      log("success!",cnt);
      get_rd1(vis1[h1]);
      get_rd2(vis2[h1]);
      return;
    }
    for(var i=0; i<4; ++i) {
      v = new State();
      v.a = new Array(9);
      for(var j=0;j<9;++j) v.a[j] = u.a[j];
      x = u.x + dir[i][0]; y = u.y + dir[i][1];
      //log("front " ,i,x,y,u.a);
      if(x<0||x>2||y<0||y>2) continue;
      v.a[u.x*3+u.y] = v.a[x*3+y];
      v.a[x*3+y] = 0;
      h2 = get_hash(v.a);
      //log("front " ,h2,v.a,h1,u.a);
      if(vis1[h2]) continue;//had been visited
      else {
        //    log("front " ,h2);
        vis1[h2] = ++num;//road
        pre[num] = new Object;
        pre[num].num = vis1[h1];
        pre[num].rd= i;
        v.x = x; v.y = y;
        que1.enqueue(v);
        if(vis2[h2]) {
          log("success!",cnt);
          get_rd1(vis1[h2]);
          get_rd2(vis2[h2]);
          return;
        }
      }
    }

    u = que2.dequeue();
    h1 = get_hash(u.a);
    if(vis1[h1]) {
      log("success!",h1,cnt);
      get_rd1(vis1[h1]);
      get_rd2(vis2[h1]);
      return;
    }
    for(var i=0; i<4; ++i) {
      v = new State();
      v.a = new Array(9);
      for(var j=0;j<9;++j) v.a[j] = u.a[j];
      x = u.x + dir[i][0]; y = u.y + dir[i][1];
        //      log("back: ",i,x,y,u.a);
      if(x<0||x>2||y<0||y>2) continue;
      v.a[u.x*3+u.y] = v.a[x*3+y];
      v.a[x*3+y] = 0;
      h2 = get_hash(v.a);
      //      log("back: ",h2,v.a,h1,u.a);
      if(vis2[h2]) continue;//had been visited
      else {
      //        log("back: ",h2);
        vis2[h2] = ++num;//road
        pre[num] = new Object;
        pre[num].num = vis2[h1];
        pre[num].rd=i;
        v.x = x; v.y = y;
        que2.enqueue(v);
        if(vis1[h2]) {
          log("success!",cnt,h2);
          get_rd1(vis1[h2]);
          get_rd2(vis2[h2]);
          return;
        }
      }
    }
  }

}

function bfs() {
  var u , v; var cnt=0;
  var x,y;
  vis1.fill(-1); pre.fill(0);
  vis1[h1]= -2; vis2[h2] = -2;
  pre[h1] = -1; pre[h2]=-1;
  while(!que1.isEmpty()) {
    u = que1.dequeue();
    h1 = get_hash(u.a);
    if(cnt++ == 1000) { log(">1000times");return; }
    for(var i=0; i<4; ++i) {
      v = new State();
      v.a = new Array(9);
      for(var j=0;j<9;++j) v.a[j] = u.a[j];
      x = u.x + dir[i][0]; y = u.y + dir[i][1];
      log(i,x,y,u.a);
      if(x<0||x>2||y<0||y>2) continue;
      v.a[u.x*3+u.y] = v.a[x*3+y];
      v.a[x*3+y] = 0;
      h2 = get_hash(v.a);
      log(i,h2,v.a,h1,u.a);
      if(vis1[h2]!=-1) continue;//had been visited
      else {
        log(h2);
        vis1[h2] = i;//road
        pre[h2] = h1;
        v.x = x; v.y = y;
        que1.enqueue(v);
        if(h2 == get_hash(e.a)) {
          var x = h2; var  k=0;
          while(pre[x]!=-1) {
            rd[k] = pre[x];
            k++;
            x = pre[x];
            if(k==100) {log("error"); break;}
          }
          log(cnt);
          return;
        }
      }
    }
  }
}


var fromLoc;
var toLoc;
function set_time_out(i,fLoc, tLoc) {
  setTimeout( function() {
    log(fLoc,tLoc);
    slideTile(fLoc, tLoc);
    var te = []
    for(var i=0;i<9;++i) {
      var t = Math.floor(i/3);
      te[i] = boardParts[t][i-t*3];
    }
    //log(emptyLoc,te);
    drawTiles();
    if(solved) {
      setTimeout( function() {
        alert("The algo solved it!");
      //  cover.style.display = 'block';
      }, 500 );
    }
  } , i*500 );
}

var solve = function () {
  var result =[];
  var board = [];
  var x,y; var x2,y2
  for(var i=0;i<rd.length;++i) { result[i] = rd[i]; }
  for(var i=0;i<s.a.length;++i) {
    board[i] = s.a[i];
    x = s.x; y = s.y;
  }
  log(emptyLoc);
  for(var i=0;i<result.length;++i) {
    x2 = x+ dir[result[i]][0]; y2 = y+dir[result[i]][1];
    fromLoc = new Object;
    fromLoc.x = x; fromLoc.y = y;
    toLoc = new Object;
    toLoc.x = x2; toLoc.y = y2;
    //log(board,result[i]);
    board[x*3+y] = board[x2*3+y2];
    board[x2*3+y2] = 0;
    //log(fromLoc, toLoc);
    set_time_out(i,fromLoc, toLoc);
    x = x2; y = y2;
  }

}
var search = function () {
  rd=[];
  set_start();
  bi_bfs();
  //bfs();
  log(e);
  log(get_hash(e.a));
  log(rd);
  solve();
}
