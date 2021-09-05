let formatter = new Intl.NumberFormat()

/* from: https://github.com/hiddentao/fast-levenshtein/blob/master/levenshtein.js */
let levenshtein = (function() {
  'use strict';
  
  var collator;
  try {
    collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
  } catch (err){
    console.log("Collator could not be initialized and wouldn't be used");
  }
  // arrays to re-use
  var prevRow = [],
    str2Char = [];
  
  /**
   * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
   */
  var Levenshtein = {
    /**
     * Calculate levenshtein distance of the two strings.
     *
     * @param str1 String the first string.
     * @param str2 String the second string.
     * @param [options] Additional options.
     * @param [options.useCollator] Use `Intl.Collator` for locale-sensitive string comparison.
     * @return Integer the levenshtein distance (0 and above).
     */
    get: function(str1, str2, options) {
      var useCollator = (options && collator && options.useCollator);
      
      var str1Len = str1.length,
        str2Len = str2.length;
      
      // base cases
      if (str1Len === 0) return str2Len;
      if (str2Len === 0) return str1Len;

      // two rows
      var curCol, nextCol, i, j, tmp;

      // initialise previous row
      for (i=0; i<str2Len; ++i) {
        prevRow[i] = i;
        str2Char[i] = str2.charCodeAt(i);
      }
      prevRow[str2Len] = str2Len;

      var strCmp;
      if (useCollator) {
        // calculate current row distance from previous row using collator
        for (i = 0; i < str1Len; ++i) {
          nextCol = i + 1;

          for (j = 0; j < str2Len; ++j) {
            curCol = nextCol;

            // substution
            strCmp = 0 === collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]));

            nextCol = prevRow[j] + (strCmp ? 0 : 1);

            // insertion
            tmp = curCol + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }
            // deletion
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }

            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
          }

          // copy last col value into previous (in preparation for next iteration)
          prevRow[j] = nextCol;
        }
      }
      else {
        // calculate current row distance from previous row without collator
        for (i = 0; i < str1Len; ++i) {
          nextCol = i + 1;

          for (j = 0; j < str2Len; ++j) {
            curCol = nextCol;

            // substution
            strCmp = str1.charCodeAt(i) === str2Char[j];

            nextCol = prevRow[j] + (strCmp ? 0 : 1);

            // insertion
            tmp = curCol + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }
            // deletion
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
              nextCol = tmp;
            }

            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
          }

          // copy last col value into previous (in preparation for next iteration)
          prevRow[j] = nextCol;
        }
      }
      return nextCol;
    }

  };

  return Levenshtein
  
}(this));


RegExp._parse = (str="//") => {
  let parts = str.trim().split('/')
  if (parts.length !== 3) { throw "_parse takes regexp source as a string" }
  return new RegExp(parts[1], parts[2])  
}

export function union(setA, setB) {
    var _union = new Set(setA);
    for (var elem of setB) {
        _union.add(elem);
    }
    return _union;
}

export function difference(setA, setB) {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}


let standardSets = {
  /* 
  'raw' sets are just basically lists of 
  proposed or deprecated elements I grabbed from spec
  indexes or mdn to get an overall list
  */
  raw: {
    html: new Set(`
html,base,head,link,meta,style,title,body,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,main,nav,section,blockquote,dd,dir,div,dl,dt,figcaption,figure,hr,li,main,ol,p,pre,ul,a,abbr,b,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rb,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,tt,u,var,wbr,area,audio,img,map,track,video,applet,embed,iframe,noembed,object,param,picture,source,canvas,noscript,script,del,ins,caption,col,colgroup,table,tbody,td,tfoot,th,thead,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,slot,template,acronym,applet,basefont,bgsound,big,blink,center,command,content,dir,element,font,frame,frameset,image,isindex,keygen,listing,marquee,menuitem,multicol,nextid,nobr,noembed,noframes,plaintext,shadow,spacer,strike,tt,xmp
`.trim().toLowerCase().split(',')),
    
    svg: new Set(`
a,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,script,set,solidcolor,stop,style,svg,switch,symbol,text,textPath,title,tspan,unknown,use,view
`.trim().toLowerCase().split(',')),
    
    mathml: new Set(/*`
    abs,and,annotation,annotation-xml,apply,approx,arccos,arccosh,arccot,arccoth,arccsc,arccsch,arcsec,arcsech,arcsin,arcsinh,arctan,arctanh,arg,bvar,card,cartesianproduct,ceiling,ci,cn,codomain,complexes,compose,condition,conjugate,cos,cosh,cot,coth,csc,csch,csymbol,curl,declare,degree,determinant,diff,divergence,divide,domain,domainofapplication,emptyset,encoding,eq,equivalent,eulergamma,exists,exp,exponentiale,factorial,factorof,false,floor,fn,forall,function,gcd,geq,grad,gt,ident,image,imaginary,imaginaryi,implies,in,infinity,int,integers,intersect,interval,inverse,lambda,laplacian,lcm,leq,limit,list,ln,log,logbase,lowlimit,lt,m:apply,m:mrow,maction,malign,maligngroup,malignmark,malignscope,math,matrix,matrixrow,max,mean,median,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,min,minus,mlabeledtr,mmultiscripts,mn,mo,mode,moment,momentabout,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mspace,msqrt,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,naturalnumbers,neq,none,not,notanumber,notin,notprsubset,notsubset,or,otherwise,outerproduct,partialdiff,pi,piece,piecewice,piecewise,plus,power,primes,product,prsubset,quotient,rationals,real,reals,reln,rem,root,scalarproduct,sdev,sec,sech,selector,semantics,sep,set,setdiff,sin,sinh,subset,sum,tan,tanh,tendsto,times,transpose,true,union,uplimit,variance,vector,vectorproduct,xor
`*/`
maction,math,menclose,merror,mfenced,mfrac,mglyph,mi,mlabeledtr,mmultiscripts,mn,mo,mover,mpadded,mphantom,mroot,mrow,ms,mspace,msqrt,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,semantics
`.trim().toLowerCase().split(','))
  }
}

// fixup overlaps
standardSets.raw.svg = difference(standardSets.raw.svg, standardSets.raw.html)
standardSets.raw.mathml = difference(standardSets.raw.mathml, standardSets.raw.html)

standardSets.raw.all = union(
  union(
    standardSets.raw.html, 
    standardSets.raw.svg
  ),
  standardSets.raw.mathml
)


let setFromRecords = (collection) => {
    return new Set(collection.map(rec => rec.element))
}

let filterCollection = (collection, setToInclude) => {
  return collection.filter((rec) => {
      let element = rec.element
      return setToInclude.has(element)
   })
}

let filterOutOfCollection = (collection, setToExclude) => {
  return collection.filter((rec) => {
      let element = rec.element
      return !setToExclude.has(element)
   })
}

let findMarkupErrors = (collection) => {
  return collection.filter(rec => /[^\w-|:]+/.test(rec.element))
}

let percentOf = (totalCollection, partialCollection) => {
    return (partialCollection.length/totalCollection.length * 100).toFixed(2)
}

let looksLikeAnotherSet = (collection, rec) => {
    return function (r) {
        let lowest = 10, lowestMatch 

        if ((r.element.indexOf("-") !== -1 || r.element.length <= 2) 
           || /[^\w-|:]+/.test(r.element)) { return false; }
        collection.forEach(tag => {
            let distance = levenshtein.get(r.element, tag); 
           
            if (distance < lowest) {
                lowest = distance
                lowestMatch = tag
            }
        })

        if (lowest == 1) {
            r.looksLike = lowestMatch
        }
        return r.looksLike
    }
}

export function summarize(datasetName, data, clientCol) {
  // data for pie/venn
  let collection = data
        .filter(rec => rec.client == clientCol),
      all = filterCollection(collection, standardSets.raw.all),
      html = filterCollection(collection, standardSets.raw.html),
      svg = filterCollection(collection, standardSets.raw.svg),
      mathml = filterCollection(collection, standardSets.raw.mathml),
      nonstd = collection.filter(rec => !standardSets.raw.all.has(rec.element)),
      markupErrors = findMarkupErrors(nonstd),
      possibleTypos = nonstd.filter(looksLikeAnotherSet(standardSets.raw.all)),
      namespaced = nonstd.filter((rec) => {
          return rec.element.indexOf(':') != -1
      }),
      dasherized = nonstd.filter((rec) => {
          return rec.element.indexOf('-') != -1
      }),
      globalns = nonstd.filter((rec) => {
        return /^\w*$/.test(rec.element)
      })
      
      
  
  return `
    <style>html {     
      font-family: sans-serif;
      font-size: 1rem;
    } 

    /* Change the color and size of the marker. */
    summary::-webkit-details-marker {
      color: #69c773;
      font-size: 1rem;
    }

    details {
      word-break: break-word;
      font-family: monospace;
      padding-left: 1rem;
    }
    
    summary {
      font-family: sans-serif;
      word-break: break-word;
    }
</style>
    <div>In the dataset <a href="${datasetName}">${datasetName}</a>...</div>

    <p>The HTTPArchive collected information about the DOM from ${formatter.format(collection[0].totalPages || collection[0]).total} ${clientCol} home pages</p>
    
    <details>
      <summary>Written in some standard or proposal somewhere for HTML, SVG and MathML we find
        a total of ${standardSets.raw.all.size} elements.
      </summary>
      <ul>
        <li>${standardSets.raw.html.size} from HTML itself</li>
        <li>${standardSets.raw.svg.size} from SVG</li>
        <li>${standardSets.raw.mathml.size} from MathML</li>
      </ul>
    </details>
    
    <p>
      Many of these elements are largely fiction.  That is, 
      they were never implemented, have become deprecated, etc.
    </p>
    <details>
      <summary>In practice, we encountered ${all.length} of these 
        elements with use.</summary>
        <p>Of these: </p>
        <ul>
          <li>
            <details>
              <summary>${html.length} were from HTML</summary>
              ${[...setFromRecords(html)].join()}
            </details>
          </li>
          <li>
            <details>
              <summary>${svg.length} were from SVG (excluding common to HTML)</summary>
              ${[...setFromRecords(svg)].join()}
            </details>
          </li>
          <li>
            <details>
              <summary>${mathml.length} were from MathML (excluding common to HTML)</summary>
              ${[...setFromRecords(mathml)].join()}
            </details>
          </li>
        </ul>
    </details>
    <p>
      However, we collected data on the <em>top</em> ${formatter.format(collection.length)} elements that appeared in this dataset 
      (as measured by occuring once on a home page).
    </p>
    <details>
      <summary>We collected data for ${formatter.format(collection.length - all.length)} non-standard elements we encountered on multiple home pages, and that was capped...</summary>
      No element that was collected appears on less than ${collection[collection.length-1].pages} home pages.
      The least popular standard element appears on ${
        formatter.format(
          [...collection].reverse().find(rec => standardSets.raw.all.has(rec.element)).pages
        )
      } home pages,
      while the most popular non-standard element occurs on ${
          formatter.format(
            collection.find(rec => !standardSets.raw.all.has(rec.element)).pages
          )
      } home pages.
    </p>

    <details>
        <summary>${findMarkupErrors(collection).length} (${percentOf(nonstd, findMarkupErrors(collection))}%) of these appear to be markup errors</summary> 
        <p>The following appear to be missing a critical whitespace, 
        a closing bracket or something that winds up yielding a parsed tag name 
        with unexpected characters.</p>
        ${[...setFromRecords(findMarkupErrors(collection))].join('<br>')}
    </details>

    <details>
        <summary>${namespaced.length} (${percentOf(nonstd, namespaced)}%) of these are XML namespaced</summary>
        ${[...setFromRecords(namespaced)].join('<br>')}
    </details>


    <details>
        <summary>${dasherized.length} (${percentOf(nonstd, dasherized)}%) of these are valid custom element names</summary>
        ${[...setFromRecords(dasherized)].join('<br>')}
    </details>

    <details>
        <summary>${globalns.length} (${percentOf(nonstd, globalns)}%) of these are in the global namespace</summary>
        ${[...setFromRecords(globalns)].join('<br>')}
    </details>


    <details>
        <summary>${possibleTypos.length} (${percentOf(globalns, possibleTypos)}%) are flagged as <i>possible</i> typos.</summary>
        While it's very difficult to say, and at least some of these are definitely not, 
        these elements in the global namespace have a Levenshtein distance of 
        1 from some standard element. <br>
        ${[...setFromRecords(possibleTypos)].join('<br>')}
    </details>

  `

}

export function containsTerms(datasetName, data, clientCol, terms = [], filters=[]) {
   let result = [], matchingPages = 0, matches = []
   let collection = data.filter(rec => rec.client == clientCol)
   // renamed in later collections ...
   let total = collection[0].totalPages || collection[0].total 

   if(total) { total = parseInt(total, 10) } 
   //console.log(collection[0])
   let closest = Number.MAX_SAFE_INTEGER, closestI = null
   let largestMatch = 0
   let elementsFromHTML = collection.filter((rec) => {
      let element = rec.element
      return standardSets.raw.html.has(element)
   })
   
   filters.forEach(filter => {
     collection = filterOutOfCollection(collection, standardSets.raw[filter])
   })
   collection.forEach((rec) => {
        terms.find(term => {
            let found = term.test(rec.element)
            if (found) {
                let nPages = parseInt(rec.pages, 10)
                matchingPages += nPages
                matches.push(rec.element)
                // note: this should be reworked, the below
                // was added as I realized that in multi-match
                // we were potentially re-counting domains 
                if (nPages > largestMatch) {
                  largestMatch = nPages
                }
                result.push({term: term.toString(), matched: rec.element, pages:  rec.pages})
            }
            return found
        }) 
    })

    // what is the closest native element?
    elementsFromHTML.forEach((rec, i) => {
      let abs = Math.abs(matchingPages - rec.pages)
      if (closest > abs) {
        closestI = i
        closest = abs
      }
    }) 
  let pct = matchingPages/total * 100
  let matchedset = (pct>=100) ? `all` : `${matchingPages} (${matchingPages/total * 100}%)`
  console.log(terms, result, terms.length)
  //console.log('largest, total', largestMatch, total)
  let lede = (result.length == 1) ?
    `<div>In the dataset <a href="${datasetName}">${datasetName}</a>(${clientCol}) ${matchedset} pages match the term below (closest 'standard' HTML native is <code>&lt;${elementsFromHTML[closestI].element}&gt;</code> (on ${elementsFromHTML[closestI].pages} or ${elementsFromHTML[closestI].pages/total * 100}% of pages, the ${closestI + 1}th most popular HTML element):</div>`
    :
    `<div>In the dataset <a href="${datasetName}">${datasetName}</a>(${clientCol}) at least ${largestMatch} pages (${largestMatch/total * 100}% ) match ${result.length} variants of the terms below (could be as high as ${matchingPages} if they don't appear on the same pages).. </div>`
    
  
   return `
${lede}
<ul>
  ${matches.map((match)=> {
     return `<li>${match}</li>`
   }).join('')}
</ul>
<details>
<summary>see details</summary>
<pre><code>/* Matching: 
  ${terms.join('\n  ')} 
*/ 
${JSON.stringify(result, null, 2)}</code></pre> 
</details>
      `.trim()
}

export function scatter(datasetName, data, clientCol="desktop") {
  let collection = data
        .filter(rec => rec.client == clientCol),
      all = filterCollection(collection, standardSets.raw.all),
      html = filterCollection(collection, standardSets.raw.html),
      svg = filterCollection(collection, standardSets.raw.svg),
      mathml = filterCollection(collection, standardSets.raw.mathml),
      nonstd = collection.filter(rec => !standardSets.raw.all.has(rec.element)),
      namespaced = nonstd.filter((rec) => {
          return rec.element.indexOf(':') != -1
      }),
      dasherized = nonstd.filter((rec) => {
          return rec.element.indexOf('-') != -1
      }),
      globalns = nonstd.filter((rec) => {
        return /^\w*$/.test(rec.element)
      }),
      tempHTML = html.map((rec, i)=> {
        let place = collection.indexOf(rec)
        return [place, 25, rec.element, place]
      }),
      tempSVG = svg.map((rec, i)=> {
        let place = collection.indexOf(rec)
        return [place, 25, rec.element, place]
      }),
      tempMathML = mathml.map((rec, i)=> {
        let place = collection.indexOf(rec)
        return [place, 25, rec.element, place]
      }), 
      tempNonStandardGlobal = globalns.map((rec, i) => {
        let place = collection.indexOf(rec)
        return [place, 25, rec.element, place]
      }), 
      tempDasherized = dasherized.map((rec, i) => {
        let place = collection.indexOf(rec)
        return [place, 25, rec.element, place]
      }),
      tempNamespaced = namespaced.map((rec, i) => {
        let place = collection.indexOf(rec)
        return [place, 25, rec.element, place]
      })
  
      
  return `
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <style>
    
        html,body, svg { font-size: 0.7rem; width: 100%; height: auto; background: black; box-sizing: border-box;}
        html { color: white;  }
        
        svg { width: 96%; /* height: fit-content; */ }
        [id*=container] { margin: 0; border: 1px solid gray; border-bottom: none; border-top: none; }
        text { display: none; }
        section h1 { 
            font-size: 0.9rem; 
        }
        section, section h1 {
            display: inline;
        }
        section h1::before { 
            content: '*';
            width: 1rem;
            margin-right: 0.25rem;
            color: var(--color);
            background-color: var(--color);
        }
  
        svg {
          position: absolute;
          bottom: 25%;
        }
  
        .svg svg { bottom: 23%; }
        .mathml svg { bottom: 21%; }
        .ns-global svg { bottom: 19%; }
        .dasherized svg { bottom: 17%; }
        .xml svg { bottom: 15%; }

        section circle { fill: var(--color); }

        section.html {
            --color: green;
        }
        section.svg {
            --color: #5353f5;
        }
        section.mathml {
            --color: magenta;
        }

        section.ns-global {
            --color: gray;
        }

        section.dasherized {
            --color: yellow;
        }

        section.xml{
            --color: orange;
        }

        
    </style>
    <body>
      <h1>Element Popularity Distribution</h1>
      <p> 
        The following charts plot the popularity of each group of 
        elements in HTML, SVG, and MathML. The leftmost is the first most 
        popular, the rightmost is the ${collection.length-1}th most poular 
        one (as measured by counting 1 per website containing the element).
        This is helpful for seeing the relative range of use. 
      </p>
      <section class="html">
        <h1>HTML</h1>
        <div id="html-container"></div>
      </section>

      <section class="svg">
        <h1>SVG</h1>
        <div id="svg-container"></div>
      </section>


      <section class="mathml">
        <h1>MathML</h1>
        <div id="mathml-container"></div>
      </section>

      <section class="ns-global">
        <h1>Non-standard, in the global ns</h1>
        <div id="ns-global-container"></div>
      </section>

      <section class="dasherized">
        <h1>Non-standard, dasherized</h1>
        <div id="dasherized-container"></div>
      </section>

      <section class="xml">
        <h1>Non-standard, colon</h1>
        <div id="namespaced-container"></div>
      </section>

    </body>
    <script>
var w = ${collection.length * 2};
var h = 50;

var dataset = {
  html: ${JSON.stringify(tempHTML)},
  svg: ${JSON.stringify(tempSVG)},
  mathml: ${JSON.stringify(tempMathML)},
  globalns: ${JSON.stringify(tempNonStandardGlobal)},
  dasherized: ${JSON.stringify(tempDasherized)},
  namespaced: ${JSON.stringify(tempNamespaced)}
}

//Create SVG element
function makeFor(selector="body", target = 'html') {
  
var svg = d3.select(selector)
  .append("svg")
  .attr("viewBox", "0 0 ${collection.length} 100")
  .attr("preserveAspectRatio","xMinYMid meet")
svg.selectAll("circle")
  .data(dataset[target])
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return d[0];
  })
  .attr("top100", function(d) {
    return d[0] <= 100;
  })
  .attr("top200", function(d) {
    return d[0] <= 200;
  })
  .attr("cy", function(d) {
    return d[1];
  })
  .attr("r", function(d) {
    return (d[0] <= 200) ? 12 : 6;
  })
  .attr("ref", function(d) {
    return d[2]
  })
  .attr("fill", "#00aa88")
  .on("mouseover", function(d) {	
      document.querySelector('text[ref="' + d[2] + '"]').style.display = 'block'
   })				
   .on("mouseout", function(d) {		
      document.querySelector('text[ref="' + d[2] + '"]').style.display = 'none'
        
   });

svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function(d) {
    return d[2] + ":" + d[3];
  })
  .attr("x", function(d) {
    return d[0];
  })
  .attr("y", function(d) {
    return d[1];
  })
  .attr("ref", function(d) {
    return d[2]
  })
  .attr("font-size", "20px")
  .attr("fill", "white"); 
}

makeFor('#html-container', 'html')
makeFor('#svg-container', 'svg')
makeFor('#mathml-container', 'mathml')
makeFor('#ns-global-container', 'globalns')

makeFor('#dasherized-container', 'dasherized')

makeFor('#namespaced-container', 'namespaced')

    </script>
  `
}