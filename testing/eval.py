import pandas as pd
import numpy as np

# Read the CSV
df = pd.read_csv("zprocessed_results.csv")

# Convert percentage strings to float
for col in ['llama_3.1_match', 'gemini_match', 'bert_match', 'Expected']:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Calculate absolute differences from Expected
df['llama_diff'] = abs(df['llama_3.1_match'] - df['Expected'])
df['gemini_diff'] = abs(df['gemini_match'] - df['Expected'])
df['bert_diff'] = abs(df['bert_match'] - df['Expected'])

# Calculate average difference per row
df['avg_diff'] = (df['llama_diff'] + df['gemini_diff'] + df['bert_diff']) / 3

# Calculate accuracy metrics (100 - difference)
df['llama_accuracy'] = 100 - df['llama_diff']
df['gemini_accuracy'] = 100 - df['gemini_diff']
df['bert_accuracy'] = 100 - df['bert_diff']

# Calculate overall metrics
overall_metrics = {
    'LLAMA Average Accuracy': df['llama_accuracy'].mean(),
    'Gemini Average Accuracy': df['gemini_accuracy'].mean(),
    'BERT Average Accuracy': df['bert_accuracy'].mean(),
    'Overall System Accuracy': df[['llama_accuracy', 'gemini_accuracy', 'bert_accuracy']].mean().mean()
}

# Save results
df.to_csv("analyzed_results.csv", index=False)

# Print metrics
print("\nAccuracy Metrics:")
for metric, value in overall_metrics.items():
    print(f"{metric}: {value:.2f}%")