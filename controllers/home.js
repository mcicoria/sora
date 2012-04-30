var express = require('express');
var fs = require('fs'),
	crypto = require('crypto'),
	knox = require('knox');

var app = module.exports = express.createServer();

var client = knox.createClient({
    key: 'AKIAJJ52UTWQHJPMFFDA'
  , secret: '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'
  , bucket: 'soraapp'
});

app.get('/', function (req, res, next) {
	res.end('hello world');
});
