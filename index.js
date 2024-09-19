import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const api_config = {
	headers: { 'x-cg-demo-api-key': 'CG-xodBnwJDy2qNt32AL3VEtHdu'}
};

const config = {
	params: {
		'ids': 'ethereum,solana,polygon-ecosystem-token',
		'vs_currencies': 'usd'
	}
}

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  try {
		const response = await axios.get("https://api.coingecko.com/api/v3/simple/price", config);
		const result = response.data;
		const data = new Prices(result.ethereum.usd, result.solana.usd, result['polygon-ecosystem-token'].usd)
		res.render("index.ejs", {base: data})
		console.log(req.body)
  } catch(error) {
		console.log(error.message)
		res.render()
	}
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

function Prices (x,y,z) {
	this.bitcoin = x;
	this.solana = y;
	this.polygon = z;
}