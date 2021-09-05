const express = require('express');
const crypto = require('crypto')
const fs = require('fs')
const app = express();
let data = require('./public/aug_2019.json')
const freqData = require('./public/aug_2019_freq.json')
import bodyParser from 'body-parser'
import {containsTerms, summarize, scatter, difference, union} from './public/counter.js' 
       
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
  
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
 
    
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/summarize', function (request, response) {
  // todo, skip rewriting...
  let out = 
    `${summarize('x.json', data, 'desktop')}`  
  response.send(out) 
  //fs.writeFile(`./public/permalink/${digest}.html`, out, 'utf8')
})       
 
app.get('/freq', function (request, response) {
  
  let clientFreq = freqData.filter(rec => rec.client === 'mobile')
  let formatter = new Intl.NumberFormat()
  
  let out =
    `${clientFreq.map((rec, i) => {
      return `
        <div style="width: ${rec.pct}%; background-color: yellow; margin-top: 1rem; ">${rec.name}:${rec.pct}%</div>
      `
    }).join('')}`  
  response.send(`<body style="width: 100vw;">${out}</body>`) 
})
      
 
app.post('/query', function (request, response) {
  // todo, skip rewriting...
  const hash = crypto.createHash('sha256')
  hash.update(
    request.body.dataset
    + 
    request.body.query 
    +         
    request.body.client      
  )    
  const digest = hash.digest('hex')   
       
  let query = request.body.query.split("\n").map((s) => s.replace(/\r$/g, ''))
  console.log('got it', request.body.filter, query)  
  let regexps = query.map(RegExp._parse)
  let filters = []
  if (request.body.filter && !Array.isArray(request.body.filter)) {
    filters = [request.body.filter]
  } else {
    filters = Array.from(request.body.filter || [])
  }    
  data = require(`./public/${request.body.dataset}`)
  let out =
    `<div><a href="/permalink/${digest}.html">permalink</a> <a href="/">query more</a></div>
    ${containsTerms(request.body.dataset, data, request.body.client, regexps, filters)}
    `    
  response.send(out)
  fs.writeFile(`./public/permalink/${digest}.html`, out, 'utf8')
})      
           
app.get('/delta/:dataset/:one/:two', function(request, response) {
  let one = require(`./public/${request.param('one')}.json`),
      two = require(`./public/${request.param('two')}.json`)
   
  
  let oneSet = new Set(one.map((item) => { return item.element}))
  let added = two.filter(item => !oneSet.has(item.element) && item.client == request.param('dataset'))
  added.sort((a, b) => {
    return b.pages - a.pages
/*    if (a.pages < b.pages) { return 1 }
    if (a.pages > b.pages) { return -1 }
    return 0*/
  }) 
  
  let out = `<h1>${added.length} new appearances in the ${request.param('dataset')} dataset from ${request.param('two')} that weren't in ${request.param('one')}</h1><ul>`
  added.forEach(item => {
    out += `<li>${escape(item.element)} (${item.pages} pages, or about ${(item.pct === 0 ? '< 0.0001%' : `~${item.pct}%`)}) </li>`
  })
  out += '</ul>'
  
  response.end(out)
  
})

app.get('/scatter/html', function (request, response) {
  response.send(scatter(request.body.dataset, data, request.body.client))
})   
// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});                                   