# Sample PALM2 prompt and response app.
- use `npm start` or `npm run dev`

### About App
- Pexel API: 
    - Pexel Image Api: Free image api. Restrictions: the API is rate-limited to 200 requests per hour and 20,000 requests per month. See: https://www.pexels.com/api/documentation/#photos-search
    - api route: `app.get('/api/pexel/image/:term'` -> `https://api.pexels.com/v1/search?query=${term}` 
- PALM2 API:
  - Where to get API key: https://makersuite.google.com/app/apikey 
  - Is it free? Yes, sorta: https://ngyibin.medium.com/how-to-get-access-to-googles-palm-2-large-language-model-21379f27c078#:~:text=At this stage%2C you may,use%2C unlike GPT-4. 
  - Google Cloud Console: for managing/view compute/usage stats https://console.cloud.google.com/ 
  - Basic Hello World: https://developers.generativeai.google/tutorials/text_node_quickstart 
  - Why not use Bard?
    - It doesn't consistently work with its cookie system: 
    - Resources if you want to work with Bard anyways: 
        - APIkey: As of 17 Nov, 2023 it is no longer available.
        - Getting Cookie: https://www.automatebard.com/2023/04/17/how-to-get-cookie-value-for-bard/ 
        - Basic Hello world: https://bard-ai.js.org/basics/ask/ 

## Important Notes
- GoogleAuth: to authenticate your apikey
- LLM Model Types used: `MODEL_NAME = "models/chat-bison-001";`
    - other types: https://developers.generativeai.google/models/language 
    - Model Tuning: https://developers.generativeai.google/guide/model_tuning_guidance
- LLM Libraries: 
    - DiscussServiceClient: full chat with ai. Has memory of prior conversations. Slow ETA 17s response time
    - TextServiceClient: simple prompt with ai. No memory of prior convos.Fast ETA 4s response time
        - Image: `getRecipeImage()` yeah this doesn't work. It just looks like a real link and very similar to a real one, but it's never a real working link 


### cleaned responses 
- 5 candidates (raises possibility of at least one is successful)

```
{
    "success0": {
        "content": {
            "recipe": {
                "title": "Chocolate Spaghetti",
                "description": "A delicious and decadent dessert.",
                "ingredients": "1 box spaghetti, 1/2 cup chocolate chips, 1/2 cup heavy cream, 1/4 cup butter, 1 teaspoon vanilla extract",
                "instructions": "Step1. Cook spaghetti according to package directions., Step2. While spaghetti is cooking, melt butter in a saucepan over medium heat., Step3. Add chocolate chips to the melted butter and stir until melted., Step4. Add heavy cream and vanilla extract to the chocolate mixture and stir until combined., Step5. Pour chocolate sauce over cooked spaghetti and serve immediately."
            }
        }
    },
    "failed4": {
        "reason": {
            "lineNumber": 1,
            "columnNumber": 1
        }
    }
}
```

### dirty JSON responses: 
- added `( / to the ``` )` for readme visibility formatting purposes. It's triple backticks json then the actual json
- sometimes trailing commas in arrays
- trailing comma outside of json obj 
- Take note of the new lines, returns, tabs, spaces \n \r \t and a few other variations whe parsing

```
    /```json
    {"recipe": {
        "title": "Chicken Teriyaki",
        "description": "A delicious and easy chicken teriyaki recipe.",
        "ingredients": [
            "1 pound boneless, skinless chicken breasts",
            "1/4 cup soy sauce",
            "1/4 cup mirin",
            "1/4 cup brown sugar",
            "1 tablespoon garlic powder",
            "1 tablespoon grated ginger",
            "1/4 cup vegetable oil",
            "1/4 cup chopped green onions",
            "1 tablespoon sesame seeds"
        ],
        "instructions": [
            "1. Preheat oven to 350 degrees F (175 degrees C).",
            "2. In a large bowl, combine the chicken breasts, soy sauce, mirin, brown sugar, garlic powder, and ginger. Marinate the chicken for at least 30 minutes, or up to overnight.",
            "3. Heat the oil in a large skillet over medium heat. Add the chicken breasts and cook until browned on all sides.",
            "4. Transfer the chicken breasts to a baking sheet and bake for 15-20 minutes, or until cooked through.",
            "5. While the chicken is baking, make the sauce. In a small saucepan, combine the soy sauce, mirin, brown sugar, and garlic powder. Bring to a boil over medium heat, then reduce heat and simmer for 5 minutes, or until thickened.",
            "6. Remove the chicken from the oven and pour the sauce over it. Sprinkle with green onions and sesame seeds. Serve immediately."
        ]
    }}
    /```
    /```json
    {"recipe": {
        "title": "Chicken Teriyaki",
        "description": "A delicious and easy chicken teriyaki recipe.",
        "ingredients": [
            "1 pound boneless, skinless chicken breasts",
            "1/4 cup soy sauce",
            "1/4 cup white vinegar",
            "1/4 cup brown sugar",
            "1/4 cup ketchup",
            "1 tablespoon garlic powder",
            "1 tablespoon ground ginger",
            "1/2 teaspoon black pepper",
            "1/4 cup vegetable oil",
            "1/2 cup chopped green onions"
        ],
        "instructions": [
            "1. Preheat oven to 400 degrees F (200 degrees C).",
            "2. In a large bowl, combine the soy sauce, vinegar, brown sugar, ketchup, garlic powder, ginger, and black pepper.",
            "3. Add the chicken breasts to the bowl and stir to coat.",
            "4. Cover the bowl and refrigerate for at least 30 minutes, or up to overnight.",
            "5. Remove the chicken from the marinade and place on a baking sheet.",
            "6. Bake for 20-25 minutes, or until cooked through.",
            "7. While the chicken is baking, make the sauce. In a small saucepan, combine the soy sauce, vinegar, brown sugar, ketchup, garlic powder, ginger, and black pepper. Bring to a boil over medium heat, then reduce heat and simmer for 5 minutes.",
            "8. Remove the chicken from the oven and pour the sauce over it.",
            "9. Sprinkle with chopped green onions and serve.",
        ]
    }}/```
```

### Ai prompt rules config
- the prompt to the PALM2 

``` 
    let introStr = `Give me a recipe that includes: ${str}`
    let rulejson = sampleJSON;
    let query = `${introStr} ${str} ${rulejson}`
    
    //introStr gives simple context
    //str is the user input
    //below is the rulejson for how ai's prompt should respond. Based on LangChain's style
    
    
    
    Follow the instructions and format your response to match the format instructions, no matter what!
    You must format your output as a JSON value that adheres to a given "JSON Schema" instance.
    
    "JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.
    
    For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}}}
    would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
    Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.
    
    Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!
    
    Your output must be formatted exactly like this. The recipe object must have title, description, ingredients, instructions: 
    /```json{"recipe":{"title":"Carrots and Beans Stir Fry","description":"A delicious and nutritious stir fry with carrots and beans.","ingredients":"2 tablespoons olive oil, 1 clove garlic, minced, 1 teaspoon ginger, grated, Salt and pepper to taste, Soy sauce for flavor (optional),","instructions":"Step1. Heat olive oil in a pan over medium heat., Step2. Add minced garlic and grated ginger. Sauté until fragrant., Step3 Add sliced carrots and chopped green beans to the pan., Step4 Stir fry the vegetables until they are tender but still crisp."}} /```

```
