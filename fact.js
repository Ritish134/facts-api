const express = require('express');
const serverless = require('serverless-http');
const app = express();

const cheerio = require('cheerio');
const axios = require('axios');

const factWebsites = [
    {
        name: "https://www.thefactsite.com/1000-interesting-facts/",
        selector: '.site.grid-container.container.hfeed p.list'
    },
    {
        name: "https://www.dk.com/uk/article/12-unbelievable-facts-that-believe-it-or-not-are-true/",
        selector: 'section.element.htmlblock p span[id^="docs-internal-guid"] span'
    },
    {
        name: "https://www.ef.com/wwen/blog/language/unbelievable-facts-make-you-seem-cultured/",
        selector: '.cn-content-area.content-article .Post_content__Eicya ol li p'
    },
    {
        name: "https://www.funkidslive.com/learn/top-10-facts/top-10-unbelievable-facts/",
        selector: '.container-fluid h2.wp-block-heading'
    },
    {
        name: "https://www.savit.in/unknown-facts.php",
        selector: '.step_vert_right p.title'
    },
    {
        name: "https://www.idtech.com/blog/computer-science-facts-collection-of-interesting-statistics",
        selector: '.block.generic-content h3'
    },
    {
        name: "https://enggkatta.com/computer-facts/",
        selector: '.cm-entry-summary ol li'
    },

];

const facts = [];




app.get('/.netlify/functions/facts', async (req, res) => {
    try {
        for (const website of factWebsites) {
            await fetchDataFromWebsite(website.name, website.selector);
        }

        // Add index or ID to each fact
        const factsWithIndex = facts.map((fact, index) => ({ id: index + 1, ...fact }));

        res.json(factsWithIndex);
    } catch (error) {
        console.error('Internal Server Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const fetchDataFromWebsite = async (url, selector) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        const html = response.data;
        const $ = cheerio.load(html);


        // Example: Uncomment and modify this section based on your actual HTML structure
        $(selector).each(function () {
            const title = $(this).text();
            facts.push({ title });
        });
    } catch (error) {
        console.error(`Error fetching data from ${url}`, error);
        throw error;
    }
};

module.exports = app;
module.exports.handler = serverless(app);
