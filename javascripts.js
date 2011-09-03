function translate(word, startlang, endlang) {
    new Ajax.Request("http://finnpauls.de/interwikidict/query.php?lang1="+startlang+"&lang2="+endlang+"&word="+word, {
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
    //Draggables
     new Draggable('lang_de', { revert: true, onEnd: function () {    onEndAction();    } });
     new Draggable('lang_en', { revert: true, onEnd: function () {    onEndAction();    } });
     new Draggable('lang_fr', { revert: true, onEnd: function () {    onEndAction();    } });
     new Draggable('lang_it', { revert: true, onEnd: function () {    onEndAction();    } });
     new Draggable('lang_pl', { revert: true, onEnd: function () {    onEndAction();    } });
     new Draggable('lang_es', { revert: true, onEnd: function () {    onEndAction();    } });
     new Draggable('lang_ja', { revert: true, onEnd: function () {    onEndAction();    } });
     //Droppables
    Droppables.add('outputbox', { 
    accept: 'lang',
    hoverclass: 'accept',
    onDrop: function(element) { 
    onDropAction(element, 'targetlang', 'outputbox');   },
    onHover: function(element) {
    onHoverAction(element, 'startlang', 'outputbox');
    }
    });
    Droppables.add('translateinput', { 
    accept: 'lang',
    hoverclass: 'accept',
    onDrop: function(element) { 
    onDropAction(element, 'startlang', 'outputbox');   },    
    onHover: function(element) {
    onHoverAction(element, 'targetlang', 'inputbox');
    }
  });
}

function onDropAction (element, lang, box) {
    langcode = element.id.split('_');
    
    if(!(langcode[1] == $('startlang').value || langcode[1] == $('targetlang').value)) {
    $(lang).value = langcode[1]; 
    $(lang+'info').innerHTML = element.innerHTML;
    } 
    translate($('translateinput').value, $('startlang').value, $('targetlang').value);
}

function onHoverAction (element, lang, box) {
 langcode = element.id.split('_');
 if(langcode[1] == $(lang).value) {
   $(box).setAttribute("class", "reject");   
 }
}

function onEndAction() {
  $('inputbox').setAttribute("class", "input-box");  
  $('outputbox').setAttribute("class", "output-box");  
}
