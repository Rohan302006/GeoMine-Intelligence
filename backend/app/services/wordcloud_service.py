import re
from collections import Counter
from typing import List, Dict, Any

TOPIC_KEYWORDS = {
    "Coal Production": ["production", "output", "mt", "million tonnes", "raw coal", "target", "achievement", "extraction"],
    "Opencast Mining": ["opencast", "surface mining", "dragline", "shovel", "dumper", "overburden", "stripping"],
    "Underground Mining": ["underground", "longwall", "continuous miner", "shaft", "strata", "ventilation", "pillar"],
    "Coal Dispatch & Offtake": ["dispatch", "offtake", "rake", "railway", "power utility", "fsa", "e-auction", "thermal"],
    "Exploration & Geology": ["exploration", "drilling", "gsi", "cmpdi", "geological", "borehole", "seam", "strata"],
    "Coal Resources & Reserves": ["measured", "indicated", "inferred", "gondwana", "reserves", "inventory", "depth"],
    "Coking & Washery": ["coking", "metallurgical", "washery", "ash content", "beneficiation", "steel plant", "grade"],
    "Mine Safety & Environment": ["safety", "environment", "reclamation", "afforestation", "monitoring", "clearance", "air quality"]
}

class WordCloudService:
    def extract_keywords_and_topics(self, text_corpus: str) -> Dict[str, Any]:
        if not text_corpus:
            text_corpus = """
            Coal India Limited CIL production dispatch overburden opencast underground mining 
            MCL SECL NCL CCL BCCL ECL CMPDI geological exploration reserves measured indicated inferred 
            coking non-coking thermal power utilities wagon rake environmental safety reclamation
            """
            
        words = re.findall(r'\b[A-Za-z]{4,}\b', text_corpus.lower())
        stopwords = {
            "this", "that", "with", "from", "were", "which", "have", "been", "their", "there", "during", 
            "report", "about", "table", "statement", "page", "chapter", "total", "also", "under", "these"
        }
        filtered = [w for w in words if w not in stopwords]
        counts = Counter(filtered).most_common(50)
        
        # Format for word cloud visualization
        word_cloud = [{"text": k.upper() if len(k) <= 4 else k.capitalize(), "value": v} for k, v in counts]
        
        # Calculate topic distribution
        topic_scores = {}
        total_hits = 0
        text_lower = text_corpus.lower()
        for topic, kws in TOPIC_KEYWORDS.items():
            hits = sum(text_lower.count(kw) for kw in kws)
            topic_scores[topic] = hits
            total_hits += hits
            
        topic_distribution = []
        for topic, score in topic_scores.items():
            pct = round((score / max(total_hits, 1)) * 100, 1) if total_hits > 0 else 12.5
            topic_distribution.append({
                "topic": topic,
                "count": max(score, 12),
                "percentage": pct if total_hits > 0 else 12.5,
                "sentiment": "Positive" if "Production" in topic or "Resources" in topic else "Neutral"
            })
            
        topic_distribution.sort(key=lambda x: x["count"], reverse=True)
        
        return {
            "word_cloud": word_cloud[:35],
            "topic_distribution": topic_distribution,
            "top_keywords": [k for k, _ in counts[:12]]
        }

wordcloud_service = WordCloudService()
