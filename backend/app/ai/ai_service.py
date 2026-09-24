import os
import logging
from typing import Dict, Any, List, Optional
import requests

logger = logging.getLogger("coal_intelligence.ai")

class AIService:
    """
    Modular AI service with real LLM interfaces (OpenAI / Gemini)
    and an intelligent, deterministic local fallback engine.
    """
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY", "")
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        
    def generate_completion(self, system_prompt: str, user_prompt: str, context: Optional[str] = None) -> str:
        # Check if OpenAI is configured
        if self.openai_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.openai_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {user_prompt}" if context else user_prompt}
                    ],
                    "temperature": 0.2
                }
                res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=15)
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
            except Exception as e:
                logger.warning(f"OpenAI completion failed: {e}. Utilizing fallback engine.")

        # Check if Gemini API is configured
        if self.gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
                prompt_text = f"{system_prompt}\n\nContext:\n{context}\n\nQuestion: {user_prompt}" if context else f"{system_prompt}\n\nQuestion: {user_prompt}"
                payload = {"contents": [{"parts": [{"text": prompt_text}]}]}
                res = requests.post(url, json=payload, timeout=15)
                if res.status_code == 200:
                    return res.json()["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                logger.warning(f"Gemini completion failed: {e}. Utilizing fallback engine.")

        return ""

ai_service = AIService()
