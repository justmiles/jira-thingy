upload:
	gapps upload
	
watch:
	inotifywait -r -m -e modify `pwd`/src/*.coffee | while read path _ file; do coffee --no-header --bare --compile $$path$$file && gapps upload; done