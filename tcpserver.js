var dnode = require('dnode');
var net = require('net');
var fs = require('fs');
var through = require('through');
var ws = null;

var server = net.createServer(function (c) {
    var d = dnode({
        transform : function (s, cb) {
            cb(s.replace(/[aeiou]{2,}/, 'oo').toUpperCase())
        },
        save: function(filepath){
          console.log(filepath);
          var saveStream = fs.createReadStream(filepath);
          saveStream.on('end', function(err){
            if(err) console.log(err);
            console.log('save complete');
          });
          saveStream.pipe(fs.createWriteStream('data1.txt'));
        },
        save2: function(err, data){
          fs.writeFile('data1.txt', data, function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
          });
        },
        saveStream : function(cb){
          cb()
        },
	onData: function(chunk, filename){
		if(!ws) ws = fs.createWriteStream(filename);
		ws.write(chunk);
		console.log('saved chunk\n');
	},
	onEnd: function(chunk){
		if(chunk)ws.write(chunk);
		ws.end();
		ws = null;
		console.log('saved file');
	}
    });
    c.pipe(d).pipe(c);
});

server.listen(5004);

