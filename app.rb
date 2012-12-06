# app.rb

require 'rubygems'
require 'sinatra'
require 'haml'
require 'open-uri'
require 'json'


post '/query/:from/:to/:word' do
  url = "http://" + params[:from] + 
    ".wikipedia.org/w/api.php?action=query&prop=langlinks&titles=" + 
    params[:word] + "&lllimit=500&redirects=1&format=json"
  wikireturn = ""
  open(url,
    "User-Agent" => "Interwikitranslate: finnpauls.de/interwikidict") {|f|
    f.each_line {|line| wikireturn += line }
  }
  wikijson = JSON.parse(wikireturn)
  pageid = wikijson["query"]["pages"].keys[0]
  output = ""
  if pageid != "-1"
      wikijson["query"]["pages"][pageid]["langlinks"].each {|lang|
          if lang["lang"] === params[:to]
            output = lang["*"]
          end
      }
  end
  output
end

get '/' do
  haml :layout
end
