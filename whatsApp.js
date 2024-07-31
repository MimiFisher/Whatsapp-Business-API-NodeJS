const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
require('dotenv').config();

const AuthToken='Bearer EAAHLThwOqiIBOxbUcJ0F5fifCn291d6ONeRuaZAMIiZBs2N3PmBjt5T9uZChCPm4RzVZCgOfeZCa7VV7JBzLCLYZC4KEAdXkHdeZAQylZApgGsFBqMhQNCd8F9PBM4CD6rLcpkeJSmERIFQc4gutzeoPfMk98uJPjjukZBGpJa1TMLl0vifNfXlxpIgUoluNSnJCZCSiySYOkk1KHDkLhel3WrraipSlrN3gZDZD';
const PhoneNumberId='373490019183651'
const myToken="mimif2622";

const app = express().use(bodyParser.json());
/*app.use(bodyParser.urlencoded({
    extended: false
}));*/
app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

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
        return res.status(200).send(challenge);
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
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            let from=body.entry[0].changes[0].value.messages[0].from;
            let msg_body=body.entry[0].changes[0].value.messages[0].text.body;
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
                            body: 'Message is: ' + msg_body
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
    }
});
