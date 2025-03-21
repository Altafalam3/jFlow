# jFlow_Scraper

A powerful job scraping utility that can fetch job listings from multiple popular job boards simultaneously.

## Overview

jFlow_Scraper allows you to scrape job postings from various job boards including LinkedIn, Indeed, Glassdoor, ZipRecruiter, Google Jobs, and Bayt. The scraper returns results in a pandas DataFrame format, making it easy to analyze and process the data.

## Function Parameters

The main function `scrape_jobs()` accepts the following parameters:

### Required Parameters

- `site_name`: List of job boards to scrape from. Can be a string, list of strings, or Site enum values.
  - Available options: `"linkedin"`, `"indeed"`, `"glassdoor"`, `"zip_recruiter"`, `"google"`, `"bayt"`
- `search_term`: The job title or keywords to search for
- `location`: The location to search jobs in (e.g., "San Francisco, CA")

### Optional Parameters

- `google_search_term`: Specific search term for Google Jobs (if different from main search_term)
- `distance`: Search radius in miles (default: 50)
- `is_remote`: Filter for remote jobs only (default: False)
- `job_type`: Type of job posting
  - Options: "full_time", "part_time", "contract", "temporary", "internship"
- `easy_apply`: Filter for jobs with easy apply option (default: None)
- `results_wanted`: Number of results to fetch per site (default: 15)
- `country_indeed`: Country for Indeed search (default: "usa")
- `hours_old`: Filter for jobs posted within the last X hours
- `enforce_annual_salary`: Convert all salary data to annual format (default: False)
- `description_format`: Format for job descriptions (default: "markdown")
- `linkedin_fetch_description`: Whether to fetch full job descriptions from LinkedIn (default: False)
- `linkedin_company_ids`: List of specific LinkedIn company IDs to search within
- `offset`: Number of results to skip (default: 0)
- `verbose`: Logging verbosity level (default: 0)

## Examples

Here are some example use cases:

```python
# Basic example - Search software engineering jobs in San Francisco
jobs = scrape_jobs(
    site_name=["linkedin", "indeed"],
    search_term="software engineer",
    location="San Francisco, CA",
    results_wanted=10
)

# Remote jobs example - Search for remote data science positions
jobs = scrape_jobs(
    site_name=["linkedin", "indeed", "glassdoor"],
    search_term="data scientist",
    location="United States",
    is_remote=True,
    job_type="full_time",
    results_wanted=20
)

# Multi-site example with recent jobs
jobs = scrape_jobs(
    site_name=["linkedin", "indeed", "glassdoor", "zip_recruiter"],
    search_term="product manager",
    location="New York, NY",
    distance=25,
    hours_old=24,
    results_wanted=15
)

# Specific company search on LinkedIn
jobs = scrape_jobs(
    site_name="linkedin",
    search_term="software developer",
    linkedin_company_ids=[1441, 1035], # Example company IDs
    linkedin_fetch_description=True,
    results_wanted=30
)

# International job search
jobs = scrape_jobs(
    site_name=["indeed", "bayt"],
    search_term="software engineer",
    location="Dubai, UAE",
    country_indeed="uae",
    results_wanted=20
)
```

## Output Format

The scraper returns a pandas DataFrame with the following columns:
- job_title
- company
- location
- job_url
- date_posted
- description
- salary_source (if available)
- min_amount (salary)
- max_amount (salary)
- currency
- interval (salary frequency)
- job_type
- site (source job board)

## Notes

- The scraper runs concurrent searches across different job boards for efficiency
- Salary information is extracted both from structured data and job descriptions
- All dates are normalized to UTC
- Results are sorted by site and posting date 