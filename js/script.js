/* Author: Orlando Del Aguila
*/
$(document).ready(function(){
  $("nav ul li a").click(function(e){
    e.preventDefault();
    id = $(this).attr("href")
    $("#"+id).slideto();
  });
});
