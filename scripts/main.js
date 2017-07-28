
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
