var drop_x;
var drop_y;
var source_start_x = new Array('startlang', 'targetlang');
var source_start_y = new Array('startlang', 'targetlang');
var active_element = new Array('startlang', 'targetlang');
active_element['startlang'] = 'lang_en';
active_element['targetlang'] = 'lang_de';
source_start_x['startlang'] = '8';
source_start_x['targetlang'] = '8';
source_start_y['startlang'] = '27';
source_start_y['targetlang'] = '8';
 
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
    var draggable_options = { revert: false, onEnd: function (element) {    onEndAction(element);    }, onStart: function(element) {drop_x = element.element.offsetLeft; drop_y = element.element.offsetTop;} };
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
    } 
    translate($('translateinput').value, $('startlang').value, $('targetlang').value);
    if(element.id!=active_element[lang] && (element.id == active_element['startlang'] || element.id == active_element['startlang'])) {
     if(element.id == active_element['startlang']) {
     new Effect.Move($(active_element[lang]), { x: 400, y: 125, mode: 'absolute' });
     } else {
     new Effect.Move($(active_element[lang]), { x: 600, y: 125, mode: 'absolute' });
     }
    } else {
     new Effect.Move($(active_element[lang]), { x: source_start_x[lang], y: source_start_y[lang], mode: 'absolute' }); }
    if(active_element['startlang'] == element.id) {
    source_start_x[lang] = source_start_x['startlang'];
    source_start_y[lang] = source_start_y['startlang'];
    } else if(active_element['targetlang'] == element.id) {
    source_start_x[lang] = source_start_x['targetlang'];
    source_start_y[lang] = source_start_y['targetlang'];  
    } else {
    source_start_x[lang] = drop_x;
    source_start_y[lang] = drop_y;
    }
    active_element[lang] = element.id;
    if(lang=='startlang'){
    drop_x = 400;
    drop_y = 125;
    } else {
    drop_x = 600;
    drop_y = 125;  
    }
    

   
}

function onHoverAction (element, lang, box) {
 langcode = element.id.split('_');
 if(langcode[1] == $(lang).value) {
   $(box).setAttribute("class", "reject");   
 }
}

function onEndAction(element) {
  new Effect.Move(element.element, { x: drop_x, y: drop_y, mode: 'absolute' });
  $('inputbox').setAttribute("class", "input-box");  
  $('outputbox').setAttribute("class", "output-box");  
}
