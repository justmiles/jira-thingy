upload: build
	gapps upload

buildDeps:
	mkdir -p deps
	[ -e deps/async.js ] || curl https://raw.githubusercontent.com/caolan/async/v2.6.0/dist/async.js -o deps/async.js

build: buildDeps
	rm -rf build && mkdir -p build
	coffee --no-header --bare --output build --compile src
	rsync -rv --exclude=*.coffee deps/* build 
	rsync -rv --exclude=*.coffee src/* build 

watch:
	inotifywait -r -m -e modify `pwd`/src | while read path _ file; do make upload; done