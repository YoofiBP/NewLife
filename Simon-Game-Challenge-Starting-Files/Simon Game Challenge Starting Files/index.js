/*
Detect Key press -- Done
Store buttons in an array -- Done
Initialize game on key press
Select random button -- Done
Put selection into array -- Done
Listen to see if user picks same thing in array
If yes pick another number and add to the array
Repeat above process
If no say game over
Flash red background, play bad sound, show Gameover text
*/

// $(document).keypress(function(event){
//   alert(event.key);
// });

//Array to hold the clickable buttons
var buttons = [];

//adding button classes that represent the colors to an array
for(var i=0;i<document.getElementsByClassName('btn').length;i++)
{
  buttons.push(document.getElementsByClassName('btn')[i].getAttribute('class').split(" ")[1]);
}

/*Generate Random Number*/
function generateRandomNumber(min_value , max_value)
{
  return Math.floor(Math.random() * (max_value-min_value) + min_value) ;
}


/*==========================================================*/

function fadeQuick(button){
  $('.'+button).fadeOut(100);
  $('.'+button).fadeIn(100);
}

/*------------------------------------------------------------------------------*/

function compare(arr1, arr2){
  var equal = true;
  for(i = 0; i < arr1.length ; i++){
    if(arr1[i]!=arr2[i]){
      equal = false;
    }
  }
  return equal;
}

/*-----------------------PlAY AUDIO---------------------------------------------*/

function playAudio(class_name){
  var audio = new Audio('sounds/'+class_name+'.mp3');
  audio.play();
}


var game = [];
var player = [];


/*-----------------------------------------------------------------------------*/
var restart = false;

$(document).keydown(startGame);

function startGame(event){
  if(event.key != ""){
    var level = 1;
    var counter = 0;
    $('#level-title').text('Level '+level);
    var nextButton = buttons[generateRandomNumber(0,4)];
    fadeQuick(nextButton);
    game.push(nextButton);
    $('.btn').click(function(){
      console.log('game: '+ game);
      console.log('level :'+ level);
      console.log('counter :'+ counter);
      playAudio(this.classList[1]);
      player.push(this.classList[1]);
      if(this.classList[1]!=game[counter]){
        playAudio('wrong');
        $('#level-title').text('Press Key to try Again');
        $('body').addClass('game-over');
        setTimeout(function(){$('body').removeClass('game-over');},100);
        game = [];
        //$(document).keydown(startGame);
        /*level = 1;
        counter = 0;
        //start = false;

        player = [];
        $('.btn').click(function(){
          playAudio('wrong');
          $('#level-title').text('Press Key to try Again');
          $('body').addClass('game-over');
          setTimeout(function(){$('body').removeClass('game-over');},100);
        });
        nextButton = buttons[generateRandomNumber(0,4)];
        fadeQuick(nextButton);
        game.push(nextButton);*/
        //console.log('selection :'+this.classList[1]);
        //console.log('game :'+game[counter]);
        //$(document).on('keydown',startGame);
      }else{
        counter++;
        if(counter == level){
          level++;
          counter = 0;
        $('#level-title').text('Level '+level);
        nextButton = buttons[generateRandomNumber(0,4)];
        console.log('running');
        game.push(nextButton);
        fadeQuick(nextButton);
        //$(document).off();
      }
      }
      });
  }
}
