upload:
	gapps upload
	
watch:
	inotifywait -r -m -e modify `pwd`/src | while read path _ file; do echo $$path$$file modified; gapps upload; done