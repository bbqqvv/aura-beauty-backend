const http = require('http');

http.get('http://localhost:7000/api/product/beauty', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    const products = JSON.parse(data);
    const beautyProducts = products.data || products;
    console.log(beautyProducts.slice(0, 3).map(p => p.img));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
