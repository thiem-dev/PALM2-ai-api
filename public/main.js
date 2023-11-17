// bard stuff to exported to main.js
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express')
const cors = require('cors')

dotenv.config();


// ------------------------------------------------------------------------------------ PALM2 AI ITEMS


const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.GOOG_API_KEY;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});


// Read the JSON file
const rawData = fs.readFileSync('sample.json');
const recipeData = JSON.parse(rawData);


async function askTheCook() {
  const result = await client.generateMessage({
    model: MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 1, // Optional. The number of candidate results to generate.
    prompt: {
      // Required. Alternating prompt/response messages.
      messages: [{ content: `Give me a sweet potato fries recipe. Only respond in a json format with title, description, ingredients, and instructions like this: ${recipeData} 
        Do not provide anything else` }],
    },
  });

  const data = result[0].candidates[0].content;
  console.log('inside askCook', data)
  return data;
}

// ------------------------------------------------------------------------------------ UTIL FUNCTIONS


function parseRecipeStr(str){
  // Use a regular expression to extract the JSON string
  const regex = /```json\n([\s\S]*?)```/;
  const match = str.match(regex);
  
  if (match && match[1]) {
    const jsonString = match[1].trim();
    // console.log(jsonString);
    return jsonString;
  } else {
    return 'No JSON string found in the input text.';
  }
}



// ------------------------- LOCALHOST SERVER ITEMS

const apiPort = 3000; 
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))


app.get('/askCook', async (req, res) => {
  try{
      const resultStr = await askTheCook();
      const result = parseRecipeStr(resultStr)
      res.status(201).send(result);
  } catch (error){
      console.log(error)
      res.status(400).json(error)
  }
});

app.listen(apiPort, () => {
  console.log(`api server listening on port http://localhost:${apiPort}`)
});