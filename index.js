const AWS = require('aws-sdk');
const SES = new AWS.SES();
const axios = require("axios")

exports.handler = async event => {
    const myQuote = await axios.get("https://zenquotes.io/api/today")
    const dailyQuote = `"${ myQuote.data[0].q}" - ${myQuote.data[0].a}`

    const params = {
        Destination: {
            ToAddresses: ['bfeld@chain.io','bryant.feld@gmail.com',]
        },
        Message: {
            Body: {
                Html: { Data: dailyQuote }
            },
            Subject: {
                Data: "Daily Inspirational Quote"
            },
        },
        Source: 'bryant.feld@gmail.com'
    };

    try {
        await SES.sendEmail(params).promise();
        return {
            statusCode: 200,
            body: 'Email sent!'
        }
    } catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            body: 'Sending failed'
        }
    }
};