const isProd = process.env.NODE_ENV === 'production';
const baseURL = isProd ? 'https://www.brewtriv.com' : 'http://localhost:3000';
// const apiKey = process.env.CLAUDE_API_KEY;
// const apiURL = process.env.ANTHROPIC_URL;


export default async function fetchQuiz(title, description){

    if(title === "" || description === "") {
        //throw new Error("title or description is empty");
        return {type: "error", msg: "title or description is empty"};
    }
    
    const prompt = `give me 10 trivia questions for a quiz with the title: "${title}" and description: "${description}". Also, provide me the correct answer and 4 incorrect options. Can you put this in a JSON object with fields of question, correct, and incorrect (exclude new lines)? Only output this JSON object.`;
    const body = {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
            {role: "user", content: prompt}   
        ]
        // You can add other parameters here as needed
    };

    

    const apiEndpoint = `${baseURL}/api/anthropic/v1/messages`;
    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            body: JSON.stringify(body), 
            //headers: headers
        }).then(serverResponse => serverResponse)

        const data = await response.json();
        const dataText = data.content[0].text;
        const dataJson = dataText.replace(/(\r\n|\n|\r)/gm, "");
        //const data = await response.json()
        return JSON.parse(dataJson);
    } catch (error) {
        console.error('Error calling Claude API:', error);
        throw error;
    }
}