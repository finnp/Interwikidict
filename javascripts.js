var lang = {
from: {object: {idleposition: {x: 8, y: 27}, iso: 'en', element: {} }, labelposition: {x: 400, y: 125} },
to: {object: {idleposition: {x: 8, y: 8}, iso: 'de', element: {} }, labelposition: {x: 600, y: 125} },
drag: {targetposition: {x: 0, y: 0} } //target where the object snaps to, can be revert 
}

function lang_revert(lang_target) {
    if(lang_target==lang.from) 
    {
        return lang.to;
    } else
    {
        return lang.from;
    }

}


function onDropAction (element, lang_target, box) { // element is draggable
    // make place for the new element, if necessery, change places if you are supposed
    if(!(element == lang.from.object.element || element == lang.to.object.element))
    {
        //move old language to idleposition
        new Effect.Move(lang_target.object.element, { x: lang_target.object.idleposition.x, y: lang_target.object.idleposition.y, mode: 'absolute' });
        lang_target.object.idleposition = lang.drag.targetposition;
        lang.drag.targetposition = lang_target.labelposition; 
    } else if (element != lang_target.object.element)
    {
        //change positions
        new Effect.Move(lang_target.object.element, { x: lang_revert(lang_target).labelposition.x, y: lang_revert(lang_target).labelposition.y, mode: 'absolute' });
        //change lang object positions
        lang.drag.targetposition = lang_target.labelposition; 
        lang = {from: {object: lang.to.object, labelposition: lang.from.labelposition}, to: {object: lang.from.object, labelposition: lang.to.labelposition} , drag: lang.drag}

    }
    // set targetposition
    console.log(lang);
    
    /*
    lang_target.object.element = element;
    
    if(lang.from.object.iso == element.id) {
    lang_target.object.idleposition.x = lang.from.object.idleposition.x;
    lang_target.object.idleposition.y = lang.from.object.idleposition.y;
    } else if(lang.to.object.iso == element.id) {
    lang_target.object.idleposition.x = lang.to.object.idleposition.x;
    lang_target.object.idleposition.y = lang.to.object.idleposition.y;  
    } else {
    lang_target.object.idleposition.x = lang.drag.targetposition.x;
    lang_target.object.idleposition.y = lang.drag.targetposition.y;
    }
    
    lang_target.iso = element.dataset.iso;
    if(lang_target.iso ==lang.from.object.iso){
    lang.drag.targetposition.x = lang.labelposition.from.x;
    lang.drag.targetposition.y = lang.labelposition.from.y;
    } else {
    lang.drag.targetposition.x = lang.labelposition.to.x;
    lang.drag.targetposition.y = lang.labelposition.to.y;  
    }
    */
        translate(); 

   
}

function onStartAction(element) {
   lang.drag.targetposition.x = element.element.offsetLeft; 
   lang.drag.targetposition.y = element.element.offsetTop;
}

function onHoverAction (element, lang_target, box) {
  if(element.dataset.iso == lang_target.iso) {
   $(box).setAttribute("class", "reject");   
 }
}

function onEndAction(element) {
  new Effect.Move(element.element, { x: lang.drag.targetposition.x, y: lang.drag.targetposition.y, mode: 'absolute' });
  $('inputbox').setAttribute("class", "input-box");  
  $('outputbox').setAttribute("class", "output-box");  
}


function translate() {

    new Ajax.Request("http://finnpauls.de/interwikidict/query.php?lang1="+lang.from.object.iso+"&lang2="+lang.to.object.iso+"&word="+$('translateinput').value, {
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
    lang.from.object.element = $('lang_en');
    lang.to.object.element = $('lang_de');
    var draggable_options = { onEnd: function (element) {    onEndAction(element);    }, onStart: function(element) {onStartAction(element);} };
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