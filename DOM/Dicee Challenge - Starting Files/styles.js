
  var num1 = generateRandomNumber(1,6);
  var num2 = generateRandomNumber(1,6);
  var pic1 = 'images/dice'+String(num1)+'.png';
  var pic2 = 'images/dice'+String(num2)+'.png';
  document.getElementsByClassName('img1')[0].setAttribute('src',pic1);
  document.getElementsByClassName('img2')[0].setAttribute('src',pic2);
  if(num1>num2){
    document.getElementsByTagName('h1')[0].innerText = 'Player One wins!';
  }
  else if(num1 == num2){
    document.getElementsByTagName('h1')[0].innerText = 'Draw!';
  }
  else{
    document.getElementsByTagName('h1')[0].innerText = 'Player Two wins!';
  }


function generateRandomNumber(min_value , max_value)
{
    return Math.floor(Math.random() * (max_value-min_value) + min_value) ;
}
