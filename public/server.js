// bard stuff to exported to main.js
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");
const fs = require('fs');
const json5 = require('json5'); //makes json format more forgiving 
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

const sampleJSON = fs.readFileSync('rules5.json')

async function getAiRecipeOne(str) {
    let introStr = `Give me a recipe that includes: ${str}`
    let rulejson = sampleJSON;
    let query = `${introStr} ${str} ${rulejson}` 

    const result = await client.generateMessage({
        model: MODEL_NAME, // Required. The model to use to generate the result.
        temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
        candidateCount: 5, // Optional. The number of candidate results to generate.
        prompt: {
            // Required. Alternating prompt/response messages.
            messages: [{ content: query }],
        },
    });
    const data = result[0].candidates;
    return data;
}


// chat has a memory, using only single chat
const client2 = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const MODEL_NAME2 = "models/text-bison-001";

async function getAiRecipeTwo(str) {
  let introStr = `Give me a recipe that includes: ${str}`
  let rulejson = sampleJSON;
  let query = `${introStr} ${str} ${rulejson}` 

  const result = await client2.generateText({
    model: MODEL_NAME2,
    temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 5, // Optional. The number of candidate results to generate.
    prompt: {
      text: query,
    },
  });

  const data = result[0].candidates;
  console.log(result)
  const outputs = data.map(item => item.output);
  return outputs;
}

// So close to an actual working image link. I need to figure out why later
async function getRecipeImage(){
  let query = `Give me two links from Google Images of fried chicken in json format, make sure to check it works and it isn't a 404 error, don't make things up. It needs to be from the internet`;
  const result = await client.generateMessage({
    model: MODEL_NAME, // Required. The model to use to generate the result.
    temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 1, // Optional. The number of candidate results to generate.
    prompt: {
        // Required. Alternating prompt/response messages.
        messages: [{ content: query }],
      },
  });

  const data = result[0].candidates[0].content;
  return data;
}

// ------------------------------------------------------------------------------------ UTIL FUNCTIONS

// less harsh parser 
function parseRecipeStr(str){
  console.log(str)
  // Use a regular expression to extract the JSON string
  try{
    const regex = /```json([\s\S]*?)```/;
    const match = str.match(regex);
    const jsonString = match[1].trim();
    
  
    let cleanedContent = jsonString
    .replace(/\n/g, '')   // Remove newlines
    .replace(/\t/g, '')   // Remove tabs
    .replace(/\r/g, '')   // Remove carriage returns
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space)
    .replace(/\\/g, '') // remove the backslashes

    // console.log(cleanedContent)

    return cleanedContent;

  } catch (error){
    console.error(error);
  }
}

const filterAndParseJSON = (array) => {
  const jsonObj = {}; // Change to an object instead of an array
  // console.log(array)

  array.forEach((item, index) => {
    try {
      // Attempt to parse the "content" property as JSON
      const contentStr = item;
      const parsedStr = parseRecipeStr(contentStr);
      // console.log(parsedStr)

      const recipeObj = json5.parse(parsedStr);

      jsonObj[`success${index}`] = {content: recipeObj };
    } catch (error) {

      const contentStr = item;
      const parsedStr = parseRecipeStr(contentStr);

      jsonObj[`failed${index}`] = { reason: error, content: parsedStr };
      return error;
    }

  });

  return jsonObj;
};



// ------------------------- LOCALHOST SERVER ITEMS

const apiPort = 3000; 
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))



app.post('/api/ai/recipe', async (req, res) => {
  const { userInput } = req.body

  try{
      const resultCandidates = await getAiRecipeTwo(userInput);
      
      // res.send(resultCandidates);
      res.send(filterAndParseJSON(resultCandidates));
      

  } catch (error){
      console.log(error)
      res.status(400).json(error)
  }
});

app.post('/api/ai/recipeimage', async (req, res) => {
  // const { userInput } = req.body

  try{
      const resultStr = await getRecipeImage();
      res.status(201).send(resultStr); //checking varying results
      // const result = parseRecipeStr(resultStr)
      // res.status(201).send(result);
  } catch (error){
      console.log(error)
      res.status(400).json(error)
  }
});

app.get('/api/pexel/image/:term', async (req, res) => {  
  const { term } = req.params
    // term = 'cake'
  
  const url = `https://api.pexels.com/v1/search?query=${term}`
  
  console.log('getting images from', url);
  
  fetch(url, {
      headers: {
          'Authorization': process.env.PEXEL_API_KEY,
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods':'GET, POST'
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      // Process the data (array of photos)
      // console.log(data);
      res.send(data);
      // You can now use the data to display images or perform other actions
  })
  .catch(error => {
      console.error('Error:', error);
  });
});


app.listen(apiPort, () => {
  console.log(`api server listening on port http://localhost:${apiPort}`)
});