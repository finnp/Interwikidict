var drop_x;
var drop_y;
var lang = {
from: {idleposition: {x: 8, y: 27}, iso: 'en'},
to: {idleposition: {x: 8, y: 8}, iso: 'de'}
}

function onDropAction (element, lang_target, box) {
    if(element.dataset.iso!=lang_target.iso && (element.dataset.iso == lang.from.iso || element.dataset.iso == lang.to.iso)) {
     if(element.dataset.iso == lang.from.iso) {
     new Effect.Move($("lang_"+lang_target.iso), { x: 400, y: 125, mode: 'absolute' });
     } else {
     new Effect.Move($("lang_"+lang_target.iso), { x: 600, y: 125, mode: 'absolute' });
     }
    } else {
     new Effect.Move($("lang_"+lang_target.iso), { x: lang_target.idleposition.x, y: lang_target.idleposition.y, mode: 'absolute' }); }
    if(lang.from.iso == element.id) {
    lang_target.idleposition.x = lang.from.idleposition.x;
    lang_target.idleposition.y = lang.from.idleposition.y;
    } else if(lang.to.iso == element.id) {
    lang_target.idleposition.x = lang.to.idleposition.x;
    lang_target.idleposition.y = lang.to.idleposition.y;  
    } else {
    lang_target.idleposition.x = drop_x;
    lang_target.idleposition.y = drop_y;
    }
    lang_target.iso = element.dataset.iso;
    if(lang_target.iso ==lang.from.iso){
    drop_x = 400;
    drop_y = 125;
    } else {
    drop_x = 600;
    drop_y = 125;  
    }
        translate(); 

   
}

function onHoverAction (element, lang_target, box) {
  if(element.dataset.iso == lang_target.iso) {
   $(box).setAttribute("class", "reject");   
 }
}

function onEndAction(element) {
  new Effect.Move(element.element, { x: drop_x, y: drop_y, mode: 'absolute' });
  $('inputbox').setAttribute("class", "input-box");  
  $('outputbox').setAttribute("class", "output-box");  
}

function translate() {

    new Ajax.Request("http://finnpauls.de/interwikidict/query.php?lang1="+lang.from.iso+"&lang2="+lang.to.iso+"&word="+$('translateinput').value, {
        onLoading: function(){
          //loading
        },
		onSuccess: function(transport){
        $('outputbox').innerHTML  = transport.responseText;
       },
       on404: function(){
         //404
       }
	});
}

window.onload=function()
{
    var draggable_options = { onEnd: function (element) {    onEndAction(element);    }, onStart: function(element) {drop_x = element.element.offsetLeft; drop_y = element.element.offsetTop;} };
    //Draggables
     new Draggable('lang_de', draggable_options);     
     new Draggable('lang_en', draggable_options);
     new Draggable('lang_fr', draggable_options);
     new Draggable('lang_it', draggable_options);
     new Draggable('lang_pl', draggable_options);
     new Draggable('lang_es', draggable_options);
     new Draggable('lang_ja', draggable_options);
     //Droppables
    Droppables.add('outputbox', { 
    accept: 'lang',
    hoverclass: 'accept',
    onDrop: function(element) { 
    onDropAction(element, lang.to, 'outputbox');   },
    onHover: function(element) {
    onHoverAction(element, lang.from, 'outputbox');
    }
    });
    Droppables.add('translateinput', { 
    accept: 'lang',
    hoverclass: 'accept',
    onDrop: function(element) { 
    onDropAction(element, lang.from, 'outputbox');   },    
    onHover: function(element) {
    onHoverAction(element, lang.to, 'inputbox');
    }
  });
}