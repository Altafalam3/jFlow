from core import scrape_jobs

jobs = scrape_jobs(
    site_name=["indeed", "linkedin"],  # You can use any combination of: linkedin, indeed, glassdoor, zip_recruiter, google, bayt
    search_term="software engineer",
    location="San Francisco, CA",
    results_wanted=10,  # Number of results you want per site
    hours_old=24  # How recent the job postings should be
)

# Print the results
print(f"Found {len(jobs)} jobs")
print(jobs.head())

# Save to CSV if needed
jobs.to_csv("jobs.csv", index=False)