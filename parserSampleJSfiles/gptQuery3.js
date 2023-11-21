const json5 = require('json5');


function parseRecipeStr(str){
    const regex1 = /```json\n([\s\S]*?)```/;
    const regexStr2 = str.match(regex1);

    console.log('regexStr2',regexStr2)

    const regex2 = /"recipe"\s*:\s*{[^{}]*}/;
    const dirtyStr = regexStr2.match(regex2);
  
    let cleanedStr = dirtyStr[1]
      .replace(/\n/g, '')   // Remove newlines
      .replace(/\t/g, '')   // Remove tabs
      .replace(/\r/g, '')   // Remove carriage returns
      .replace(/\s+/g, ' '); // Replace multiple spaces with a single space


    console.log('cleanedStr',cleanedStr)

    const recipeObject = json5.parse(cleanedStr)
    return recipeObject;
    // console.log(recipeObject)

  
}

let str1 = ```json{"recipe":{"title":"Carrots and Beans Stir Fry","description":"A delicious and nutritious stir fry with carrots and beans.","ingredients":["2 cups carrots, sliced","1 cup green beans, chopped","2 tablespoons olive oil","1 clove garlic, minced","1 teaspoon ginger, grated","Salt and pepper to taste","Soy sauce for flavor (optional)"],"instructions":["1. Heat olive oil in a pan over medium heat.","2. Add minced garlic and grated ginger. Sauté until fragrant.","3. Add sliced carrots and chopped green beans to the pan.","4. Stir fry the vegetables until they are tender but still crisp.","5. Season with salt and pepper to taste.","6. If desired, add soy sauce for extra flavor.","7. Continue to stir fry for an additional 2-3 minutes.","8. Remove from heat and serve hot.","9. Enjoy your delicious Carrots and Beans Stir Fry!"]}}```

console.log(parseRecipeStr(str1))