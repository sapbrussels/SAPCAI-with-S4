const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');

app.use(bodyParser.json());

// https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata/sap/API_PLANNED_ORDERS/A_PlannedOrder
// Header: APIKey: 8qi4TtUbQJqbavul7nT3PW5D0oX2VHuW

async function getOrder(req, res) {
  const instance = axios.create({
    baseURL: 'https://sandbox.api.sap.com',
    timeout: 1000,
    headers: {'APIKey': '8qi4TtUbQJqbavul7nT3PW5D0oX2VHuW'}
  });

  try {
    const response = await instance.get('/s4hanacloud/sap/opu/odata/sap/API_PLANNED_ORDERS/A_PlannedOrder');
    console.log(response);
    if(response.data.d.results) {
      const data = response.data.d.results;
      const orders = data.map(o => {
        return { Id: o.PlannedOrder, TotalQuantity: o.TotalQuantity }
      })

      return res.status(200).json({
        replies: [
          { type: 'text', content: `I have found ${orders.length} orders.` },
          { type: 'text', content: `But your order was not found, If you want I can send you to our support desk.` },
          ]
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
}

app.get('/order', getOrder);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
