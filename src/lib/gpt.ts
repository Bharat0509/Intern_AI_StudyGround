const {
  GoogleGenerativeAI,
  // HarmCategory,
  // HarmBlockThreshold,
} = require("@google/generative-ai");

const API_KEY ="AIzaSyCdUps_dq5qYmDe4yToaesdz2PgG9qG_Bc" ?? process.env.REACT_APP_API_KEY;

const MODEL_NAME = "gemini-1.5-pro-latest";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  systemInstruction:
    "As an Intelligent AI agent, your role is to serve as an effective teacher, providing easily understandable information to Student . Your responses should be easy to understand and to the point, ensuring that learners grasp the topic effortlessly. Focus on explaining concepts in a simple and straightforward manner, prioritizing clarity and comprehension.It should contain all the textbook information",
});

const generationConfig = {
  temperature: 1,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 8192,
  responseMimeType:  "application/json",
};

// const safetySettings = [
//   {
//     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//   },
// ];

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model_name: string = MODEL_NAME,
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  const list_input: boolean = Array.isArray(user_prompt);
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  let error_msg: string = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
      output_format
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
    }

    // const response = await model.generateText({
    //   prompt: system_prompt + output_format_prompt + error_msg,
    //   examples: [{ input: user_prompt.toString() }],
    //   config: generationConfig,
    //   // safetySettings: safetySettings,
    // });
    console.log("It's here")
    const chat = model.startChat({
      generationConfig,
      history: [],
    });
    const results = await chat.sendMessage(system_prompt + output_format_prompt + error_msg);
    const response = results?.response;

    // let res: string = response.output;

    // res = res.replace(/(\w)"(\w)/g, "$1'$2");

    // if (verbose) {
    //   console.log(
    //     "System prompt:",
    //     system_prompt + output_format_prompt + error_msg
    //   );
    //   console.log("\nUser prompt:", user_prompt);
    //   console.log("\nGPT response:", res);
    // }

    try {
      let output: any = JSON.parse(response);

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in a list of json");
        }
      } else {
        output = [output];
      }

      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) {
            continue;
          }

          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          output[index] = Object.values(output[index]);
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${response}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      console.log("Current invalid json format:", response);
    }
  }

  return [];
}

// Function to generate quiz questions
export async function generateQuizQuestions(system_prompt:any,user_prompt:any,output_format_prompt:any) {
  const prompt = `
  User Input:
  Topic: ${user_prompt}
  
  Desired Output:
  ${system_prompt}
  
  Example JSON Object Structure:
  ${output_format_prompt}
`  
  const chat = model.startChat({
    generationConfig,
    history: [],
  });
  const results = await chat.sendMessage(prompt);
  const res = results?.response;
  const text = res.text()
  console.log("Question ",text)
  return text;

  //return strict_output(system_prompt, topic, output_format, "", false);
}

// Function to explain a topic
export async function explainTopic(topic: string,setHistory:any) {

  const prompt = `
  User Input:
  Topic: ${topic}
  
  Desired Output:
  Generate an array of JSON objects where each object contains one of the following: detailed information, an image URL, or a 3D model URL related to the topic. Ensure that the information is accurate, relevant, and comprehensive. The JSON array should include:
  Detailed information about the topic.For first detail object add one appropriate Heading.
   Up to 5 images objects with link.
   Optionally, include up to 3 3D model objects if relevant models are available on Sketchfab.
   Example JSON Object Structure:
   [
    {
      "type": "details",
      "content": "The Solar System is composed of the Sun and the objects that orbit it, including eight planets, their moons, and dwarf planets. The Sun contains 99.86% of the Solar System's mass."
    },
    {
      "type": "details",
      "content": "The planets in the Solar System are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has unique characteristics, such as Jupiter being the largest and Mercury being the smallest."
    },
    {
      "type": "image",
      "url": "https://example.com/images/solar_system_overview.jpg"
    },
    {
      "type": "image",
      "url": "https://example.com/images/planets.jpg"
    },
    {
      "type": "image",
      "url": "https://example.com/images/solar_system_planets.jpg"
    },
    {
      "type": "image",
      "url": "https://example.com/images/solar_system_orbits.jpg"
    },
    {
      "type": "image",
      "url": "https://example.com/images/solar_system_sun.jpg"
    },
    {
      "type": "3d_model",
      "url": "https://sketchfab.com/3d-models/solar-system-xyz123"
    },
    {
      "type": "3d_model",
      "url": "https://sketchfab.com/3d-models/planets-abc456"
    },
    {
      "type": "3d_model",
      "url": "https://sketchfab.com/3d-models/solar-system-animation-def789"
    }
  ]
`  
  const chat = model.startChat({
    generationConfig,
    history: [],
  });
  const results = await chat.sendMessage(prompt);
  const res = results?.response;
  setHistory((history: any) => [...history, res.candidates[0].content]);
  const text =JSON.parse(res.text())
  return text;
  // return strict_output(system_prompt, topic, output_format, "", true);
}

