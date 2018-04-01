/**
 * Created by lnelson on 4/12/16.
 */
var $ = require('cheerio');
var fs = require('fs');
var walk = require('walk');
var path = require('path');


var search_root = '/Users/lnelson/meteor_home/positiveday/public/content';

var files = {};


String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");


function make_template(name, path) {
    var content = '<template name="{0}">\n{1}\n</template>';
    return content.format([name, path])
}

// Walker options
var walker = walk.walk(search_root, {followLinks: false});

walker.on('file', function (root, stat, next) {
    var re = new RegExp(' ', 'g');
    // Add this file to the list of files
    var extension = path.extname(stat.name);
    if (extension === '.html' || extension === '.htm') {
        var filename = path.basename(stat.name, extension);
        var templatename = filename.replace(re, '_');
        if (!stat.name.startsWith('index')) {
            var pathname = root + '/' + stat.name;
            files[filename] = {
                template: templatename,
                path: pathname
            };
        }
    }
    next();
});

function writeTheTemplateFile(fs, tfilename, content) {
    fs.writeFile(
        tfilename,
        content,
        function (err) {
            if (err) {
                return console.log(tfilename + ':' + err);
            }
            console.log(tfilename + ' saved');
        });

}

walker.on('end', function () {
    var cheerio = require('cheerio');
    var fs = require('fs');
    var templatePath = '/Users/lnelson/Desktop/tcontent/';

    var fkeys = Object.keys(files);
    for (var fkey in files) {
        var filename = files[fkey].path;
        var tname = files[fkey].template;
        var htmlString = fs.readFileSync(filename).toString();
        var parsedHTML = cheerio.load(htmlString);
        parsedHTML('img').attr('src', function (ini, ine) {
            return '/images/' + ine
        });
        var tfilename = templatePath + tname + '.html';
        // Prepend all image paths with /images/ as per Meteor convention for static images
        var inner_html_content = parsedHTML('body').html();
        console.log(inner_html_content);
        if (inner_html_content) inner_html_content = inner_html_content.trim();
        var content = make_template(tname, inner_html_content);
        if (content) {
            writeTheTemplateFile(fs, tfilename, content)
            /*
             parsedHTML('img').map(function (i, e) {
             var srcUrl = parsedHTML(e).attr('src');
             console.log(srcUrl);
             })
             */
        } else {
            console.log('Could not read ' + filename);
            return
        }
    }
});

/*
 var htmlString = fs.readFileSync('index.html').toString()
 var parsedHTML = $.load(htmlString)

 // query for all body elements
 parsedHTML('body').map(function (i, foo) {
 foo = $(foo)
 console.log(foo.text())
 })
 */