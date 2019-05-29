$('nav a').addClass('hvr-bob');
$('.card a').addClass('hvr-pulse');
$('.card').addClass('hvr-float-shadow');

function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}