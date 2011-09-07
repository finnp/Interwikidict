var lang = {
from: {object: {idleposition: {x: 8, y: 27}, iso: 'en', element: {} }, labelposition: {x: 400, y: 125} },
to: {object: {idleposition: {x: 8, y: 8}, iso: 'de', element: {} }, labelposition: {x: 600, y: 125} },
drag: {targetposition: {x: 0, y: 0} } //target where the object moves to, when released (can be revert)
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

function onDropAction (element, lang_target) { 
    // make place for the new element, if necessery, change places if you are supposed
    if(!(element == lang.from.object.element || element == lang.to.object.element))
    {
        //move old language to idleposition
        new Effect.Move(lang_target.object.element, { x: lang_target.object.idleposition.x, y: lang_target.object.idleposition.y, mode: 'absolute' });
        //change lang_target information
        lang_target.object.element = element;
        lang_target.object.iso = element.dataset.iso;
        lang_target.object.idleposition.x = lang.drag.targetposition.x;
        lang_target.object.idleposition.y = lang.drag.targetposition.y;
        // set targetposition to the correct labelposition
        lang.drag.targetposition.x = lang_target.labelposition.x;
        lang.drag.targetposition.y = lang_target.labelposition.y;
    } else if (element != lang_target.object.element)
    {
        //change positions
        new Effect.Move(lang_target.object.element, { x: lang_revert(lang_target).labelposition.x, y: lang_revert(lang_target).labelposition.y, mode: 'absolute' });
        //change lang object positions
        lang.drag.targetposition.x = lang_target.labelposition.x; 
        lang.drag.targetposition.y = lang_target.labelposition.y; 
        lang = {from: {object: lang.to.object, labelposition: lang.from.labelposition}, to: {object: lang.from.object, labelposition: lang.to.labelposition} , drag: lang.drag}

    }
    translate(); 
}

function onStartAction(element) {
   lang.drag.targetposition.x = element.element.offsetLeft; 
   lang.drag.targetposition.y = element.element.offsetTop;
}


function onEndAction(element) {
  new Effect.Move(element.element, { x: lang.drag.targetposition.x, y: lang.drag.targetposition.y, mode: 'absolute' });
}


function translate() {

    new Ajax.Request("http://finnpauls.de/interwikidict/query.php?lang1="+lang.from.object.iso+"&lang2="+lang.to.object.iso+"&word="+$('translateinput').value, {
        onLoading: function(){
          //loading
        },
		onSuccess: function(transport){
        $('wikioutput').innerHTML  = transport.responseText.evalJSON(true).translation;
        source_info_wikipedia();
       },
       on404: function(){
         //404
       }
	});
}

function source_info_wikipedia() {
    $('sourceoutput').innerHTML = "Tanslation based on the Wikipedia articles <a href='http://"+lang.from.object.iso+".wikipedia.org/wiki/"+$('translateinput').value+"'>"+$('translateinput').value+"</a> and <a href='http://"+lang.to.object.iso+".wikipedia.org/wiki/"+$('wikioutput').innerHTML+"'>"+$('wikioutput').innerHTML+"</a>";
}

window.onload=function()
{
    $('translateinput').onkeyup = 
        function(event)
        {
            if(event.keyCode == 13)
            {
                translate();
            }
        }
    lang.from.object.element = $('lang_en');
    lang.to.object.element = $('lang_de');
    var draggable_options = { handle: 'drag_move', onEnd: function (element) {    onEndAction(element);    }, onStart: function(element) {onStartAction(element);} };
    //Draggables
     new Draggable('lang_de', draggable_options);     
     new Draggable('lang_en', draggable_options);
     new Draggable('lang_fr', draggable_options);
     new Draggable('lang_it', draggable_options);
     new Draggable('lang_pl', draggable_options);
     new Draggable('lang_es', draggable_options);
     new Draggable('lang_ja', draggable_options);
     //Droppables
    Droppables.add('outputface', { 
    accept: 'lang',
    hoverclass: 'accept',
    onDrop: function(element) { 
    onDropAction(element, lang.to);   }
    });
    Droppables.add('translateinput', { 
    accept: 'lang',
    hoverclass: 'accept',
    onDrop: function(element) { 
    onDropAction(element, lang.from);   }
    });
}