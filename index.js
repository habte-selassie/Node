const fs = require('fs')
const http = require('http')
const url = require('url')



// const textIn = fs.readFileSync('./txt/input.txt','utf-8')

// console.log(textIn);

// const textOut = `this is what we know about avocado:${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log('File Written');

// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data1)=>{
//         console.log(data1);
//         fs.readFile('./txt/append.txt','utf-8',(err,data2)=>{
//             console.log(data2);

//             fs.writeFile('./txt/final.txt',`${data1}\n${data2}`,'utf-8',err=>{
//                  console.log('final file');
//             })
//         })
//     })
// })

// console.log('hi');
//(__dirname) 

//const file = require('./templates/template-card.html')

const replaceTemplate = (temp,product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productname)
    output = temp.replace(/{%IMAGE%}/g,product.image)
    output = temp.replace(/{%PRICE%}/g,product.price)
    output = temp.replace(/{%FROM%}/g,product.from)
    output = temp.replace(/{%NUTRIENTS%}/g,product.nutrients)
    output = temp.replace(/{%QUANTITY%}/g,product.quantity)
    output = temp.replace(/{%DESCRIPTION%}/g,product.description)
    output = temp.replace(/{%ID%}/g,product.id)
   
   if(!product.organic) output = temp.replace(/{%NOT_ORGANIC%}/g,'not-organic')
   return output
}

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
  );
  const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
  );
  const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
  );
  

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req,res)=>{
  //console.log(url.parse(req.url));
  const {query , pathname} = url.parse(req.url,true)
    
     
  if(pathname === '/' || pathname === '/overview' ){

    res.writeHead(200,{'Content-type':'text/html'}) 

    const cardsHtml = dataObj.map(el=>replaceTemplate(tempCard,el)).join('')
    const output = tempOverview.replace(/{%PRODUCTCARDS%}/,cardsHtml)
    

        res.end(output)
    }

    else if(pathname === '/product'){
      res.writeHead(200,{'Content-type':'text/html'}) 
      const product = dataObj[query.id]
      const output = replaceTemplate(tempProduct,product)
      res.end(output)
    }

    else if (pathname === '/api'){
    res.writeHead(200,{'Content-type':'application/json'})    
     res.end(data)
    }
   
    else{

        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'Hi'
        })
        res.end('<h1>Page Not Found</h1>')
       
    }
    
})

server.listen(7000,()=>{
    console.log(`Listening on port 7000`);
})
