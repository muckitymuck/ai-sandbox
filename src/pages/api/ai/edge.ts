import { OpenAIStream } from "@/utils/open_ai_stream";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  //   const { prompt } = (await req.json()) as {
  //     prompt?: string;
  //   };

  const prompt = "tell me a 100 word story about a cat";

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
