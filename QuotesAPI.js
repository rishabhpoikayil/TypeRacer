const axios = require('axios');

// Using the ZenQuotes API for fetching a random quote.
const uri = "https://zenquotes.io/api/random";

module.exports = getData = () => {
    return axios.get(uri)
        .then(response => response.data) // The data returned is an array with one quote object
        .then(quotes => {
            if (quotes.length > 0) {
                const selectedQuote = quotes[0].q; // Get the text of the selected quote
                return selectedQuote.split(" "); // Split the selected quote into words
            }
            return []; // Return an empty array if no quotes are found
        })
        .catch(error => {
            console.error('Error fetching quotes:', error);
            throw error;
        });
}
