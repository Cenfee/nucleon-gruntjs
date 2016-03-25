
var projectPath = process.argv[2];


var fs = require('fs-extra')

fs.removeSync("./build");

fs.copySync(projectPath, './build');


const Imagemin = require('imagemin');

new Imagemin()
    .src('./build/asset/**/*.{gif,jpg,png,svg}')
    .dest('./build/asset')
    .use(Imagemin.jpegtran({progressive: true}))
    .run((err, files) => {
	console.log(err);
        console.log(files);
        //=> {path: 'build/images/foo.jpg', contents: <Buffer 89 50 4e ...>}
    });