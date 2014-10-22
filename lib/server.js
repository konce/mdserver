"use strict";
var connect = require('connect');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
var serveMarkdown = require('serve-markdown');
var options = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');
var moment = require('moment');


/**
 * init options
 */
function initOptions(options) {
    var defaultOptions = {
        'root': process.cwd(),
        port: '3333'
    };
    return merge(defaultOptions, options);
}

/**
 * start server with provided options
 */
function startServer(options) {

    options = initOptions(options)

    var app = connect();
    var root = options.root;

    app.use(log);
    // serve markdown file
    app.use(serveMarkdown(root));
    // common files
    app.use(serveStatic(root, {'index': ['index.html']}));
    // directory index
    app.use(serveIndex(root, {'icon': true}))

    app.listen(options.port);

    // server start success
    console.log(chalk.blue('serve start Success: ')
                + '\n'
                + chalk.green('\t url   ')
                + chalk.grey('http://127.0.0.1:')
                + chalk.red(options.port)
                + chalk.grey('/')
                + '\n'
                + chalk.green('\t serve ')
                + chalk.grey(options.root)
               );
}

module.exports = startServer;

/**
 * simple log middleware, output the access log
 **/
function log(req, res, next) {
    console.log('['
                + chalk.grey(ts())
                + '] '
                + chalk.white(decodeURI(req.url))
            );
    next()
}

/**
 * get current timestamp
 */
function ts() {
    return moment().format('HH:mm:ss')
}

/**
 * simple merge
 * @description if property `p` of a is not `undefined`, set a[p] = b[p]
 */
function merge(a, b) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    for (var p in b ) {
        if (hasOwnProperty.call(b, p) && b[p] !== undefined) {
            a[p] = b[p];
        }
    }

    return a;
}