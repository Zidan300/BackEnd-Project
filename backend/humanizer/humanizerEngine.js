const { buildHumanizerPrompt } = require("./humanizerPrompt");


// ==========================================
// HUMANIZER ENGINE
// ==========================================

async function humanizeText(text, mode = "natural") {

    if (!text || !text.trim()) {
        throw new Error("Text is required.");
    }


    const prompt = buildHumanizerPrompt(
        text,
        mode
    );


    const response = await fetch(
        "http://localhost:11434/api/chat",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: "llama3.2:3b",

                messages: [

                    {
                        role: "user",
                        content: prompt
                    }

                ],

                stream: false,

               options: {
               
                   temperature: 0.45,
               
                   top_p: 0.85,
               
                   top_k: 30
               
               }

            })
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Ollama error: ${errorText}`
        );
    }


    const data =
        await response.json();


    if (
        !data.message ||
        !data.message.content
    ) {
        throw new Error(
            "Ollama returned an empty response."
        );
    }


    return data.message.content.trim();
}


module.exports = {
    humanizeText
};
