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

const sampleJSON = fs.readFileSync('rules1.json')

async function getAiRecipe(str) {
    let introStr = `Give me a recipe that includes: ${str}`
    let rulejson = sampleJSON;
    let query = `${introStr} ${str} ${rulejson}` 

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
    //   console.log('inside askCook', data)
    return data;
}

// So close to an actual working image link. I need to figure out why later
async function getRecipeImage(){
  let query = `give me a 1 real publicly accessible working image link to fried chicken in json format, make sure to check it works and it isn't a 404 error, don't make things up. It needs to be from the internet`;
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
//   console.log('inside askCook', data)
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


app.post('/api/ai/recipe', async (req, res) => {
    const { userInput } = req.body

    try{
        const resultStr = await getAiRecipe(userInput);
        res.status(201).send(resultStr); //checking varying results
        // const result = parseRecipeStr(resultStr)
        // res.status(201).send(result);
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