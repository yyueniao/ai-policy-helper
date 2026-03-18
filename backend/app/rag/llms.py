from typing import Dict, List


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
        header = (
            "You are a helpful company policy assistant. "
            "Cite sources by title and section when relevant.\n"
            f"Question: {query}\n"
            "Sources:\n"
        )
        
        source_blocks = []
        for c in contexts:
            title = c.get('title', 'Unknown Title')
            section = c.get('section', 'General')
            text_snippet = c.get('text', '')[:600]
            
            block = f"- {title} | {section}\n{text_snippet}\n---"
            source_blocks.append(block)
            
        footer = "Write a concise, accurate answer grounded in the sources. If unsure, say so."
        
        return f"{header}\n" + "\n".join(source_blocks) + f"\n\n{footer}"

    def generate(self, query: str, contexts: List[Dict]) -> str:
        prompt = self._get_prompt(query, contexts)
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role":"user","content":prompt}],
            temperature=0.1
        )
        return resp.choices[0].message.content
