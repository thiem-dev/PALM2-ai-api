// bard stuff to exported to main.js
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
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

const sampleJSON = fs.readFileSync('rules1.json')

async function getAiRecipe(str) {
    let introStr = `Give me a recipe that includes: ${str}`
    let rulejson = sampleJSON;
    let query = `${introStr} ${str} ${rulejson}` 

    const result = await client.generateMessage({
        model: MODEL_NAME, // Required. The model to use to generate the result.
        temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
        candidateCount: 2, // Optional. The number of candidate results to generate.
        prompt: {
            // Required. Alternating prompt/response messages.
            messages: [{ content: query }],
        },
    });
    const data = result[0].candidates;
    return data;
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
  
    const cleanedContent = jsonString
    .replace(/\n/g, '')   // Remove newlines
    .replace(/\t/g, '')   // Remove tabs
    .replace(/\r/g, '')   // Remove carriage returns
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space)
    .replace(/\\/g, '') // remove the backslashes
    .replace(/,\s*]/, ']') // Use the replace method to remove the trailing comma in the "ingredients" array

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
      const contentStr = item.content;
      const parsedStr = parseRecipeStr(contentStr);
      // console.log(parsedStr)

      const recipeObj = json5.parse(parsedStr);

      jsonObj[index] = { content: recipeObj };
    } catch (error) {

      const contentStr = item.content;
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
      const resultCandidates = await getAiRecipe(userInput);
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

app.listen(apiPort, () => {
  console.log(`api server listening on port http://localhost:${apiPort}`)
});