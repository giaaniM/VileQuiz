const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const API_KEY = process.env.GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

console.log(`Testing API Key: ${API_KEY.substring(0, 10)}...`);

async function testKey() {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('✅ API Key is VALID!');
        console.log('Response:', response.data.choices[0].message.content);
    } catch (error) {
        console.error('❌ API Key is INVALID or Error occurred:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testKey();
