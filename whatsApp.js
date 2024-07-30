const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
require('dotenv').config();

const AuthToken='Bearer EAAHLThwOqiIBOwdOnA5O8v3P7x4Adj4zr3bexn5wpEWyZCQCkCZB7qKXd1PtZCUWmeZB2CJQ6UF4IZC9zApEimIp25ZBUYuRhMjsXWz3ybDuVOc1EkSWCEXDuZCvTSTeWBcsMVx7aOYWkSOiJTNVj5B4imfDY6085ibJmyFz8JHmhRSs92e5CSHT78R177vVdAEVZAfNby68T3mOZAuaU1ZAfGWJ6RBwkZD';
const PhoneNumberId='325807853959150'
const myToken="mimif2622";

const app = express().use(bodyParser.json());
/*app.use(bodyParser.urlencoded({
    extended: false
}));*/

app.get('/', (req, res) => {
    let resData = {
    }
    resData.message = 'Running';
    return res.status(200).json(resData);
});

app.get('/sendMessage', (req, res) => {
    let resData = {
        status: false,
        error: ''
    }
    try {
        const options = {
            method: 'POST',
            url: 'https://graph.facebook.com/v20.0/' + PhoneNumberId + '/messages',
            headers: {
                Authorization: AuthToken,
                'Content-Type': 'application/json'
            },
            body: {
                messaging_product: 'whatsapp',
                to: '+13473894047',
                type: 'text',
                text: {
                    body: 'Hi, Welcome!'
                }
            },
            json: true
        };
        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            
            resData.status = true;
            resData.respondData = body;
            return res.status(200).json(resData);
        });
    } catch (e) {
        resData.status = 404;
        resData.error = e;
        return res.status(200).json(resData);
    }
});

//verify callback url from dashboard side - cloud api
app.get("/webhook", (req, res)=>{
    let mode=req.query["hub.mode"];
    let challenge=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    if (mode==="subscribe" && token===myToken){
        return res.status(200).json(challenge);
    } else {
        return res.status(403).json("error: wrong request");
    }
});

app.post("/webhook", (req,res)=>{
    let body=req.body;

    console.log(JSON.stringify(body, null, 2));

    if(body.object){
        if(body.entry && 
            body.entry[0].changes &&
            body.entry[0].changes[0].value.message && 
            body.entry[0].changes[0].value.message[0]
        ) {
            let phone_number_id=body.entry[0].changes[0].value.metadata.phone_number_id;
            let from=body.entry[0].changes[0].value.messages[0].from;
            let msg_body=body.entry[0].changes[0].value.messages[0].text.body;

            axios({
                method: 'POST',
                url: 'https://graph.facebook.com/v20.0/325807853959150/messages',
                headers: {
                    Authorization: 'Bearer EAAHLThwOqiIBO0Y3iQfgQPpcZA4G5lxS42YBTQCuN9DbRWDSpbZC5HsCkj7brqqHZClkXnThxACGXpJtgvrT9r8XWJitJ8vYyaNnM0EMg4vipacQwFh0aQ0KclxQh0WoOLuvlPPnCZA4eOz6vH9lIB6RZA8Klq1cJqZA9u3gulp4X6e3IwKHTNqBg2p5fpTjopqUz2y0U74dKgGk05g2oOhLgQhEgZD',
                    'Content-Type': 'application/json'
                },
                data:{
                    messaging_product:"whatsapp",
                    to:to,
                    text:{
                        body:"Hi, its working!"
                    }
                },
            });

            resData.status = true;
            resData.respondData = data;
            return res.status(200).json(resData);
        } else{
            res.sendStatus(404);
        }

        try {
            const options = {
                method: 'POST',
                url: 'https://graph.facebook.com/v20.0/373490019183651/messages',
                headers: {
                    Authorization: 'Bearer EAAHLThwOqiIBO0Y3iQfgQPpcZA4G5lxS42YBTQCuN9DbRWDSpbZC5HsCkj7brqqHZClkXnThxACGXpJtgvrT9r8XWJitJ8vYyaNnM0EMg4vipacQwFh0aQ0KclxQh0WoOLuvlPPnCZA4eOz6vH9lIB6RZA8Klq1cJqZA9u3gulp4X6e3IwKHTNqBg2p5fpTjopqUz2y0U74dKgGk05g2oOhLgQhEgZD',
                    'Content-Type': 'application/json'
                },
                body: {
                    messaging_product: 'whatsapp',
                    to: '+13473894047',
                    type: 'text',
                    text: {
                        body: 'Hi, Welcome!'
                    }
                },
                json: true
            };
            request(options, function(error, response, body) {
                if (error) throw new Error(error);
                
                resData.status = true;
                resData.respondData = body;
                return res.status(200).json(resData);
            });
        } catch (e) {
            resData.status = 404;
            resData.error = e;
            return res.status(200).json(resData);
        }
    }
});
