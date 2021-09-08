const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const { config } = require('./ussdModules/config');
const port = process.env.PORT || 3031;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('*', (req, res) => {
	res.send('This is SpectrumMFB USSD application');
});

config(app);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
