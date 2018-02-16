upload:
	gapps upload
	
watch:
	inotifywait -r -m -e modify `pwd`/src | while read path _ file; do node $$path$$file && gapps upload; done