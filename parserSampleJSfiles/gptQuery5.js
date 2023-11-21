function parseRecipeStr(str){
    // console.log(str)
    // Use a regular expression to extract the JSON string
    // const regex = /```json\n([\s\S]*?)```/;
    // const match = str.match(regex);
    
    // const jsonString = match[0].trim();
  
      const regex1 = /```json\n([\s\S]*?)```/;
      const dirtyStr1 = str.match(regex1);
  
      console.log('dirtyStr1 ',dirtyStr1)
  
      const cleaned1 = dirtyStr1[0].trim();
  
      console.log('cleaned1', cleaned1)
  
      const regex2 = /"recipe"\s*:\s*{[^{}]*}/;
      const dirtyStr2 = cleaned1.match(regex2);
    
      let cleanedStr = dirtyStr2[1]
        .replace(/\n/g, '')   // Remove newlines
        .replace(/\t/g, '')   // Remove tabs
        .replace(/\r/g, '')   // Remove carriage returns
        .replace(/\s+/g, ' '); // Replace multiple spaces with a single space
  
  
      console.log('cleaned2', cleanedStr);
  
      const recipeObject = json5.parse(cleanedStr)
      console.log(recipeObject)
      return recipeObject;
  }