let API_URL = `http://localhost:3000/api`


const askBtn = document.querySelector('#askBtn');

askBtn.addEventListener('click', async (e) => {
  const inputObj = {
    userInput: document.getElementById('ingredientInput').value
  };

  console.log(inputObj);

  const recipeData = await getRecipeData(inputObj);
  console.log(recipeData);
})


async function getRecipeData(obj){
  const url = `${API_URL}/ai/recipe`
  console.log(`getting from recipes from ${url}`)
  try{
      const response = await fetch(url, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('GET success', data)
      return data;
  } catch(error) {
      console.error('Error during POST request:', error);
  }
}

//TODO setup image prompt
async function getRecipeImage(obj){
  const url = `${API_URL}/ai/recipe`
  console.log(`getting from recipes from ${url}`)
  try{
      const response = await fetch(url, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('GET success', data)
      return data;
  } catch(error) {
      console.error('Error during POST request:', error);
  }
}