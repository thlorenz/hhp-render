BIN=./node_modules/.bin
BUDO=$(BIN)/budo
BROWSERIFY=$(BIN)/browserify

EXCLUDE_MODULES=
ENTRY=client.js
OUTPUT=build/bundle.js

CSS=--css index.css
PORT=-p 8833 
LIVE=-p [ livereactload --port 8834 ]
TITLE=--title 'hhp render'

watch-noreload:
	$(BUDO) $(ENTRY) $(CSS) $(PORT) $(TITLE) -- -d

watch:
	$(BUDO) $(ENTRY) $(CSS) $(PORT) $(TITLE) -- -d $(LIVE) 

watch-raw:
	$(BUDO) $(ENTRY) $(CSS) $(PORT) $(TITLE) -- -p $(LIVE) 

watch-raw-noreload:
	$(BUDO) $(ENTRY) $(CSS) $(TITLE)

bundle:
	$(BROWSERIFY) -d $(ENTRY) -o $(OUTPUT)

list:
	$(BROWSERIFY) --list $(ENTRY)
