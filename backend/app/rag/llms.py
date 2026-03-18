from typing import Dict, Generator, List


class StubLLM:
    def generate(self, query: str, contexts: List[Dict]) -> str:
        lines = [f"Answer (stub): Based on the following sources:"]
        for c in contexts:
            sec = c.get("section") or "Section"
            lines.append(f"- {c.get('title')} — {sec}")
        lines.append("Summary:")
        # naive summary of top contexts
        joined = " ".join([c.get("text", "") for c in contexts])
        lines.append(joined[:600] + ("..." if len(joined) > 600 else ""))
        return "\n".join(lines)

class OpenRouterLLM:
    def __init__(self, api_key: str, model: str = "openai/gpt-4o-mini"):
        from openai import OpenAI
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1",
        )
        self.model = model

    def _get_prompt(self, query: str, contexts: List[Dict]) -> str:
        instructions = (
            "You are an expert Corporate Policy Assistant. Your goal is to provide accurate, "
            "concise answers based strictly on the provided context.\n\n"
            "GUIDELINES:\n"
            "- Cite sources by [Title | Section] for every claim made.\n"
            "- If the answer is not contained within the sources, explicitly state: "
            "'I cannot find the answer in the available policy documents.'\n"
            "- Do not use outside knowledge or hallucinate details.\n"
        )

        source_blocks = []
        for i, c in enumerate(contexts, 1):
            title = c.get('title', 'Unknown Title')
            section = c.get('section', 'General')
            text = c.get('text', '')[:800]
            
            block = (
                f"<source id='{i}'>\n"
                f"  <metadata>{title} | {section}</metadata>\n"
                f"  <content>{text}</content>\n"
                f"</source>"
            )
            source_blocks.append(block)
        
        context_str = "\n".join(source_blocks)

        full_prompt = (
            f"{instructions}\n"
            f"<context>\n{context_str}\n</context>\n\n"
            f"USER QUESTION: {query}\n"
            f"ASSISTANT ANSWER:"
        )
        
        return full_prompt

    def generate(self, query: str, contexts: List[Dict]) -> Generator[str, None, None]:
        prompt = self._get_prompt(query, contexts)
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role":"user","content":prompt}],
            temperature=0.1,
            stream=True
        )
        for chunk in response:
            content = chunk.choices[0].delta.content
            if content:
                yield content
