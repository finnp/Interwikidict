<?php	
// Get Translation
$start_lang = urlencode($_GET['lang1']);
$target_lang = urlencode($_GET['lang2']);
$word = urlencode($_GET['word']);
$url = "http://".$start_lang.".wikipedia.org/w/api.php?action=query&prop=langlinks&titles=".$word."&lllimit=500&redirects=1&format=json";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt ($ch, CURLOPT_HTTPHEADER, array('cache-control: no-cache')); 
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt ($ch, CURLOPT_USERAGENT, "Interwikitranslate: finnpauls.de/interwikidict"); 
$wiki_response = curl_exec ($ch);
curl_close ($ch);
$wiki_json = json_decode($wiki_response, true);
$wiki_pageid = -1;
if($wiki_json['query']['pages']){
$wiki_pageid = key($wiki_json['query']['pages']);
} 
$translation = "no translation";
if($wiki_pageid!="-1") {
foreach($wiki_json['query']['pages'][$wiki_pageid]['langlinks'] as $wiki_langlink_id) {
  if($wiki_langlink_id['lang']==$target_lang)
  {
   $translation = $wiki_langlink_id['*'];
   break;
  }
}
}
echo $translation;
/*
// Get first sentence
$url = "http://".$target_lang.".wikipedia.org/w/index.php?title=".urlencode($translation)."&action=render";
$ch = curl_init();
curl_setopt ($ch, CURLOPT_HTTPHEADER, array('cache-control: no-cache')); 
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt ($ch, CURLOPT_USERAGENT, "Interwikitranslate: finnpauls.de/interwikidict"); 
$wiki_parse = curl_exec ($ch);
*/

?>