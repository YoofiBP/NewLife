function playAudio(audioname){
var audio = new Audio('sounds/'+audioname+'.mp3');
audio.play();
}

function handleClick(){
  switch (this.classList[0]) {
    case 'w':
    playAudio('tom-1');
      break;
    case 'a':
    playAudio('tom-2');
    break;
    case 's':
    playAudio('tom-3');
    break;
    case 'd':
    playAudio('tom-4');
    break;
    case 'j':
    playAudio('snare');
    break;
    case 'k':
    playAudio('crash');
    break;
    case 'l':
    playAudio('kick-bass');
    break;
    default:
  }
  var button = document.querySelector('.'+this.classList[0])
  button.classList.add('pressed');
  setTimeout(function () {button.classList.remove('pressed');},100);
}

function handlePress(event){
  switch (event.key) {
    case 'w':
    playAudio('tom-1');
      break;
    case 'a':
    playAudio('tom-2');
    break;
    case 's':
    playAudio('tom-3');
    break;
    case 'd':
    playAudio('tom-4');
    break;
    case 'j':
    playAudio('snare');
    break;
    case 'k':
    playAudio('crash');
    break;
    case 'l':
    playAudio('kick-bass');
    break;
    default:
}
document.querySelector('.'+event.key).classList.add('pressed');
setTimeout(function () {document.querySelector('.'+event.key).classList.remove('pressed');},200);
}

document.addEventListener('keydown',handlePress);

for (var i = 0; i < document.querySelectorAll('button').length; i++) {
  document.getElementsByTagName('button')[i].addEventListener('click', handleClick);
  }
