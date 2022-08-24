const AWS = require('aws-sdk');
const SES = new AWS.SES();
const axios = require("axios")

exports.handler = async event => {
    const myQoute = await axios.get("https://zenquotes.io/api/today")
    const dailyQoute = `"${ myQoute.data[0].q}" - ${myQoute.data[0].a}`

    const params = {
        Destination: {
            ToAddresses: ['bfeld@chain.io','bryant.feld@gmail.com',]
        },
        Message: {
            Body: {
                Html: { Data: dailyQoute }
            },
            Subject: {
                Data: "Daily Inspirational Qoute"
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