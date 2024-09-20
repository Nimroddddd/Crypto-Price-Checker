import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const api_config = {
	headers: { 'x-cg-demo-api-key': 'CG-xodBnwJDy2qNt32AL3VEtHdu'}
};
var data = {}
var coinPrice = ''
var addressString = ''

const config = {
	params: {
		'ids': 'ethereum,solana,polygon-ecosystem-token',
		'vs_currencies': 'usd'
	},
  headers: { 'x-cg-demo-api-key': 'CG-xodBnwJDy2qNt32AL3VEtHdu'}
}



app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  try {
		const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", config);
		const result = response.data;
		data = new Prices(result.ethereum.usd, result.solana.usd, result['polygon-ecosystem-token'].usd)
		res.render("index.ejs", {base: data, price: coinPrice})
  } catch(error) {
		console.log(error.message)
		res.render()
	}
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const param = new PriceSearch(req.body.address);
  const searchConfig = {params: param};
  console.log(req.body.address);
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/token_price/' + req.body.chain, searchConfig);
    const result = response.data;
    console.log(coinPrice);
    coinPrice = result[req.body.address].usd
    res.redirect("/"); 
  } catch(error) {
    console.log(error.message);
    res.redirect("/");
  }
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

function Prices (x,y,z) {
	this.bitcoin = x;
	this.solana = y;
	this.polygon = z;
}

function PriceSearch (x) {
  this.contract_addresses = x,
  this.vs_currencies = 'usd'
}