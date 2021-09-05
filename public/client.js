import {containsTerms} from './counter.js'

let data
let query = document.querySelector("[name='query']")
let client = document.querySelector("[name='client']")
let output = document.querySelector('output')
let datasetPicker = document.querySelector("[name='dataset']")
let dataset = datasetPicker.options[datasetPicker.selectedIndex].value
let filterChecks = [...document.querySelectorAll("[name='filter']")]

async function go() {
  let result = await fetch(dataset)
  data = await result.json()
} 
go()

    
document
  .querySelector('form')
  .addEventListener(
    'submit', 
    async function doQuery(evt) {
      //evt.preventDefault()
      let regexps = query.value.split('\n').map(RegExp._parse)
      let filters = filterChecks.filter(el => el.checked).map(el => el.value)
      
      output.innerHTML = containsTerms(dataset, data, client.value, regexps, filters)
    }
  )

