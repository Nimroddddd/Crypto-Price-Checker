//imoirts
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

// declarations of variables
const app = express();
const port = 3000;
const api_config = {
	headers: { 'x-cg-demo-api-key': 'CG-xodBnwJDy2qNt32AL3VEtHdu'}
};
var data = {}
var coinPrice = ''

//default config for getting the prices of the three base coins from coingecko
const config = {
	params: {
		'ids': 'ethereum,solana,polygon-ecosystem-token',
		'vs_currencies': 'usd'
	},
  headers: { 'x-cg-demo-api-key': 'CG-xodBnwJDy2qNt32AL3VEtHdu'}
}


//middlewares
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));



//homepage
app.get("/", async (req, res) => {
  try {
		const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", config);
		const result = response.data;
		data = new Prices(result.ethereum.usd, result.solana.usd, result['polygon-ecosystem-token'].usd)
		res.render("index.ejs", {base: data, price: coinPrice})
  } catch(error) {
		console.log(error.message)
		res.redirect("/")
	}
});


//uses middleware to collect form data from user, then submits the relevant data to coingecko api to return the coin price.
app.post("/", async (req, res) => {
  console.log(req.body);
  const param = new PriceSearch(req.body.address);
  const searchConfig = {params: param};
  console.log(req.body.address);
  const tokenAddress = `${req.body.address}`
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/token_price/' + req.body.chain, searchConfig);
    const result = response.data;
    console.log(result);
    coinPrice = result[tokenAddress].usd
    res.redirect("/"); 
  } catch(error) {
    console.log(error.message);
    res.redirect("/");
  }
})


//port listener
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

//constructor function to simplify passing data to the homepage res.render
function Prices (x,y,z) {
	this.ethereum = x;
	this.solana = y;
	this.polygon = z;
}


// constructor function to simplify data to push to coingecko api
function PriceSearch (x) {
  this.contract_addresses = x,
  this.vs_currencies = 'usd'
}