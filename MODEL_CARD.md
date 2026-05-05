# Model Card: PW StudyVerse AI (StoryTutor)

## 1. Model Details
* **Underlying Model**: OpenAI `gpt-4o-mini` (via API).
* **Architecture**: Transformer-based Large Language Model (LLM).
* **Developer**: Integration by PW StudyVerse Team; Base Model by OpenAI.
* **Release Date / Version**: Contextual to current OpenAI API versions (2024-2026).
* **Model Format**: Cloud-based API endpoint with Structured JSON schema enforcement.

## 2. Intended Use
* **Primary Use Case**: Educational storytelling and dynamic quiz generation. The model receives a student's topic query (e.g., "Photosynthesis") and outputs a highly structured JSON object.
* **Output Structure**:
  * `title`: Educational topic title.
  * `story`: A simplified, engaging narrative explaining the concept to a student.
  * `questions`: An array of multiple-choice questions testing comprehension, containing `question`, `options`, `correctAnswer`, and `explanation`.
* **Out-of-Scope Uses**: Providing medical advice, harmful content, or executing code. The system prompt strictly limits the persona to a "helpful, child-friendly educational tutor."

## 3. Factors & Mitigations
* **Hallucinations**: Mitigated by forcing strict pedagogical system prompts and using a low temperature setting (`temperature: 0.3`).
* **Format Failures**: Mitigated by using OpenAI's `response_format: { type: "json_object" }` ensuring the UI never breaks trying to parse plain text markdown.
* **Age Appropriateness**: System instructions dictate a reading level suitable for K-12 students, avoiding complex jargon unless defined.

## 4. Metrics & Performance
* **Latency**: Leverages Next.js serverless/edge functions + `gpt-4o-mini` for fast TTFT (Time to First Token), resulting in < 3 second response times for full JSON blocks.
* **Cost Efficiency**: Uses the `-mini` model class, keeping operational API costs exceptionally low per student query (~$0.0001 per generation).

## 5. Training Data
* Relies on the foundational training data of OpenAI's GPT-4o architecture. No proprietary student PII (Personally Identifiable Information) is sent to the model or used for fine-tuning. Prompts are zero-shot based on user search queries.

## 6. Ethical Considerations & Privacy
* **Privacy**: The API operates statelessly. Student search queries are sent to OpenAI, but no session history, identifiers, or LocalStorage data is attached to the payload.
* **Bias**: The prompt engineering enforces a neutral, objective, and globally applicable educational tone.