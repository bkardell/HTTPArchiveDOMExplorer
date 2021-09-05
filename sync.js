// https://cdn.httparchive.org/reports/top10k/2021_08_01/htmlElementPopularity.json

let fetch = require('node-fetch')

let urlPath = 'https://cdn.httparchive.org/reports/top10k'
let date = new Date()
let m = date.getMonth()
let y = date.getFullYear() 
console.log(date, m)
if (m === 0) {
  m = 11
  y = y-1
} 

m = /\d\d/.test(m) ? m : `0${m}`
let url = `${urlPath}/${y}_${m}_01/htmlElementPopularity.json`
console.log(url)

fetch(url).then(r => {
  r.json().then(j => {
    console.log(j)  
  })
  
})

