// less harsh parser 
function parseRecipeStr(str){
  // Use a regular expression to extract the JSON string
  const regex = /```json\n([\s\S]*?)```/;
  const match = str.match(regex);
  const jsonString = match[1].trim();

  const cleanedContent = jsonString
  .replace(/\n/g, '')   // Remove newlines
  .replace(/\t/g, '')   // Remove tabs
  .replace(/\r/g, '')   // Remove carriage returns
  .replace(/\s+/g, ' '); // Replace multiple spaces with a single space



    return cleanedContent;
}


/* filter thru for true json, otherwise drop. (ai hallucinates bad json 50/50 chance)
- Returns array of good json candidates
*/
const filterAndParseJSON = (array) => {
  const jsonObj = {}; // Change to an object instead of an array

  array.forEach((item) => {
    try {
      // Attempt to parse the "content" property as JSON
      const contentStr = item.content;
      const parsedStr = parseRecipeStr(contentStr);

      const jsonObject = json5.parse(cleanedContent);

      jsonObj[item.author] = { content: jsonObject };
    } catch (error) {
      // Ignore errors, and return false for items that couldn't be parsed
      console.error(error)
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
      const parsedJSONItems = filterAndParseJSON(resultCandidates);
      // res.json(parsedJSONItems); //checking varying results

      res.send(parsedJSONItems)
  } catch (error){
      console.log(error)
      res.status(400).json(error)
  }
});