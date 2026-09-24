from fastapi import APIRouter
from app.services.wordcloud_service import wordcloud_service

router = APIRouter(prefix="/topics", tags=["Topics & Word Cloud"])

SAMPLE_CORPUS = """
Coal India Limited CIL Central Mine Planning Design Institute CMPDI Mahanadi Coalfields MCL
South Eastern Coalfields SECL Northern Coalfields NCL Central Coalfields CCL Bharat Coking Coal BCCL
Eastern Coalfields ECL Western Coalfields WCL Singareni SCCL raw coal production dispatch offtake
opencast surface mining dragline overburden stripping ratio underground longwall continuous miner
geological exploration seismic drilling borehole core logging measured indicated inferred Gondwana
thermal power plants captive washery beneficiation coking metallurgical grade ash content environmental
clearance forest diversion safety reclamation afforestation digital monitoring telemetry SCADA
"""

@router.get("/wordcloud")
def get_wordcloud_data():
    res = wordcloud_service.extract_keywords_and_topics(SAMPLE_CORPUS)
    return res["word_cloud"]

@router.get("/distribution")
def get_topic_distribution():
    res = wordcloud_service.extract_keywords_and_topics(SAMPLE_CORPUS)
    return res["topic_distribution"]

@router.get("/trends")
def get_topic_trends():
    return [
        {"year": "2021-22", "Opencast Mining": 74, "Underground Mining": 12, "Exploration": 45, "Safety & Environment": 38},
        {"year": "2022-23", "Opencast Mining": 82, "Underground Mining": 11, "Exploration": 52, "Safety & Environment": 46},
        {"year": "2023-24", "Opencast Mining": 91, "Underground Mining": 10, "Exploration": 64, "Safety & Environment": 55},
        {"year": "2024-25", "Opencast Mining": 98, "Underground Mining": 9, "Exploration": 78, "Safety & Environment": 68}
    ]
