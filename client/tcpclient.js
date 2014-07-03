var dnode = require('dnode');
var net = require('net');
var fs = require('fs');
var through = require('through');

var d = dnode();
d.on('remote', function (remote) {
    remote.transform('beep', function (s) {
        console.log('beep => ' + s);
    //    d.end();
    });
    var save = function(filename){
					
		return through(
			function write(data){
				remote.onData(data, filename);	
			},
			function end(){
				remote.onEnd();
				d.end();
			}
		)
	};    
    
    fs.createReadStream(__dirname + '/data.txt',{encoding:'utf-8'}).pipe(save('data1.txt'));
});

var c = net.connect(5004);
c.pipe(d).pipe(c);
