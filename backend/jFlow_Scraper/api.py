from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union
import numpy as np
import pandas as pd
import logging
import json
from core import scrape_jobs, Site

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="jFlow Scraper API",
    description="API for scraping job listings from various job boards",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ScrapeRequest(BaseModel):
    site_name: Optional[Union[str, List[str], Site, List[Site]]] = None
    search_term: Optional[str] = None
    google_search_term: Optional[str] = None
    location: Optional[str] = None
    distance: Optional[int] = 50
    is_remote: bool = False
    job_type: Optional[str] = None
    easy_apply: Optional[bool] = None
    results_wanted: int = 15
    country_indeed: str = "usa"
    proxies: Optional[Union[List[str], str]] = None
    ca_cert: Optional[str] = None
    description_format: str = "markdown"
    linkedin_fetch_description: Optional[bool] = False
    linkedin_company_ids: Optional[List[int]] = None
    offset: Optional[int] = 0
    hours_old: Optional[int] = None
    enforce_annual_salary: bool = False
    verbose: int = 0

@app.post("/scrape")
async def scrape_jobs_endpoint(request: ScrapeRequest):
    try:
        logger.info("Received scrape request with parameters: %s", request.model_dump())
        
        # Convert the request to a dictionary and remove None values
        params = {k: v for k, v in request.model_dump().items() if v is not None}
        logger.info("Processed parameters: %s", params)
        
        # Call the scrape_jobs function with the parameters
        df = scrape_jobs(**params)
        logger.info("Scraped %d jobs", len(df))
        
        # Log DataFrame info
        logger.info("DataFrame columns: %s", df.columns.tolist())
        logger.info("DataFrame dtypes: %s", df.dtypes)
        
        # Handle non-JSON serializable values
        def clean_value(val):
            if pd.isna(val):
                return None
            if isinstance(val, float):
                # Check for special float values
                if np.isinf(val) or np.isnan(val):
                    logger.warning("Found problematic float value: %s", val)
                    return None
                # Check if the float value is too large for JSON
                if abs(val) > 1.7976931348623157e+308:  # Max JSON float
                    logger.warning("Found out-of-range float value: %s", val)
                    return None
            return val

        
        # Clean all values in the DataFrame
        logger.info("Cleaning DataFrame values...")

        # When processing your DataFrame
        for column in df.columns:
            df[column] = df[column].apply(lambda x: clean_value(x))
        
        # Log sample of cleaned data
        logger.info("Sample of cleaned data (first row): %s", df.iloc[0].to_dict())
        
        # Convert DataFrame to list of dictionaries
        jobs = df.to_dict(orient='records')
        logger.info("Successfully converted DataFrame to list of dictionaries")
        
        # Additional safety check - replace any problematic values in the final dict
        def safe_for_json(obj):
            if isinstance(obj, dict):
                return {k: safe_for_json(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [safe_for_json(item) for item in obj]
            elif isinstance(obj, float):
                if not np.isfinite(obj) or abs(obj) > 1.7976931348623157e+308:
                    return None
                return obj
            else:
                return obj

        # Apply the safety function to your jobs list
        jobs = safe_for_json(jobs)

        return {
            "status": "success",
            "count": len(jobs),
            "jobs": jobs
        }
    except Exception as e:
        logger.error("Error processing request: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 