$(function () {
  	$('.navbar-toggle-sidebar').click(function () {
  		$('.navbar-nav').toggleClass('slide-in');
  		$('.side-body').toggleClass('body-slide-in');
  		$('#search').removeClass('in').addClass('collapse').slideUp(200);
  	});

  	$('#search-trigger').click(function () {
  		$('.navbar-nav').removeClass('slide-in');
  		$('.side-body').removeClass('body-slide-in');
  		$('.search-input').focus();
  	});
  });
/*
  function logOut(){
    firebase.auth().signOut().then(function(){
    console.log("Signed Out First");
  }).catch(function(error){
    console.log("Failed");
  });
  }

  $('#logout').click(logOut);*/
