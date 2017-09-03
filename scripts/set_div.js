var createDiv = function(){
    //首先创建div
    var descDiv = document.createElement('div');
    document.body.appendChild(descDiv);
    var canvas = document.getElementById('puzzle');
    //log(canvas);
    var context = canvas.getContext('2d');
    //计算div的确切位置
    var seatX = canvas.offsetLeft;//横坐标
    var seatY = canvas.offsetTop;//纵坐标
    var divWidth = canvas.offsetWidth;
    var divHeight = canvas.offsetHeight;
    //给div设置样式，比如大小、位置
    var cssStr = "z-index:5;width:"+divWidth+"px;height:"+divHeight+"px;"+
    "background-color:#f99655;position:absolute;display:block;left:"
    + seatX + 'px;top:' + seatY + 'px;';
    //将样式添加到div上，显示div
    descDiv.style.cssText = cssStr;
    descDiv.innerHTML = '按下start按键开始游戏';
    descDiv.id = 'descDiv';
    descDiv.style.filter= "alpha(opacity=50)";
    descDiv.style.opacity="0.6";
    descDiv.align="center";
    descDiv.style.lineHeight = 600 + "px";

}

createDiv();
