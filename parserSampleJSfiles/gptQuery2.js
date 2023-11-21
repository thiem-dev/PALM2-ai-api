const json5 = require('json5');

const jsonData = {
    "1": {
        "content": "{\n  \"recipe\": {\n    \"title\": \"Chicken Shawarma\",\n    \"description\": \"A delicious and flavorful Middle Eastern dish made with chicken, shawarma spice mix, yogurt, garlic, lemon juice, olive oil, and pita bread.\",\n    \"ingredients\": [\n      \"1 pound boneless, skinless chicken breasts, cut into 1-inch pieces\",\n      \"1 tablespoon shawarma spice mix\",\n      \"1/2 cup plain yogurt\",\n      \"2 cloves garlic, minced\",\n      \"1 tablespoon lemon juice\",\n      \"2 tablespoons olive oil\",\n      \"6 pita breads, warmed\",\n      \"1/2 cup chopped tomatoes\",\n      \"1/2 cup chopped cucumber\",\n      \"1/4 cup chopped red onion\",\n      \"1/4 cup chopped parsley\",\n      \"1/4 cup chopped mint\",\n      \"1/4 cup tahini sauce\",\n      \"1/4 cup hummus\",\n      \"1/4 cup baba ghanoush\",\n      \"Salt and pepper to taste\"\n    ],\n    \"instructions\": [\n      \"1. In a large bowl, combine the chicken, shawarma spice mix, yogurt, garlic, lemon juice, and olive oil. Mix well to coat the chicken. Cover and refrigerate for at least 30 minutes, or up to overnight.\",\n      \"2. Preheat the oven to 400 degrees F (200 degrees C). Line a baking sheet with parchment paper.\",\n      \"3. Spread the chicken mixture out in a single layer on the baking sheet. Bake for 20-25 minutes, or until the chicken is cooked through.\",\n      \"4. To assemble the wraps, spread a thin layer of tahini sauce on each pita bread. Top with the cooked chicken, tomatoes, cucumber, red onion, parsley, mint, and your favorite toppings. Serve immediately.\",\n      \"5. Enjoy!\"\n    ]\n  }\n}"
    }
};

// Extract content from jsonData
const contentString = jsonData["1"].content;

// Clean up the content string by removing unwanted characters
const cleanedContent = contentString
    .replace(/\n/g, '')   // Remove newlines
    .replace(/\t/g, '')   // Remove tabs
    .replace(/\r/g, '')   // Remove carriage returns
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space

try {
    // Parse the cleaned content as JSON
    const jsonObject = json5.parse(cleanedContent);

    // Log the extracted JSON object
    console.log(jsonObject);
} catch (error) {
    console.error("Error parsing JSON:", error.message);
}