var string = "";
$('h1').text('bigTitle');
$('button').text('bigTitle');
//$('h1').addClass('bigTitle');
$('h1').click(function() {
  $('h1').addClass('bigTitle');
});

$('button').click(function (){
  $('h1').addClass('bigTitle');
});

$(document).on("keydown",function(event){
  string+=event.key;
  $('h1').text(string);
});

$('button').on("mouseover", function(){
  $('h1').fadeToggle();
});
