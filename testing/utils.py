# import pandas as pd

# def merge_csvs(jd_csv_path, resume_csv_path, output_csv_path):
#     """
#     Merges two CSVs based on Role (from JD.csv) and Category (from cleaned_resume.csv).

#     Args:
#         jd_csv_path (str): Path to the JD.csv file containing jd_content and Role columns.
#         resume_csv_path (str): Path to the cleaned_resume.csv file containing resume_content and Category columns.
#         output_csv_path (str): Path to save the merged CSV.

#     Returns:
#         str: Path to the merged CSV file.
#     """
#     try:
#         # Load the two CSV files
#         jd_df = pd.read_csv(jd_csv_path)
#         resume_df = pd.read_csv(resume_csv_path)

#         # Ensure the required columns exist
#         if 'Role' not in jd_df.columns or 'Category' not in resume_df.columns:
#             raise ValueError("JD.csv must contain 'Role' and cleaned_resume.csv must contain 'Category' columns.")

#         # Merge the dataframes on Role and Category
#         merged_df = pd.merge(jd_df, resume_df, left_on='Role', right_on='Category', how='inner')

#         # Save the merged DataFrame to a new CSV file
#         merged_df.to_csv(output_csv_path, index=False)

#         return f"Merged CSV saved successfully at: {output_csv_path}"

#     except Exception as e:
#         return f"Error while merging CSVs: {str(e)}"


# # Example usage
# if __name__ == "__main__":
#     jd_csv_path = "JD.csv"  # Path to your JD CSV
#     resume_csv_path = "cleaned_resume.csv"  # Path to your cleaned_resume CSV
#     output_csv_path = "testcases.csv"  # Path to save the merged CSV

#     result_message = merge_csvs(jd_csv_path, resume_csv_path, output_csv_path)
#     print(result_message)
import pandas as pd

def merge_csvs(jd_csv_path, resume_csv_path, output_csv_path):
    """
    Merges two CSVs based on Role (from JD.csv) and Category (from cleaned_resume.csv),
    and filters by the 'Information-Technology' category.

    Args:
        jd_csv_path (str): Path to the JD.csv file containing jd_content and Role columns.
        resume_csv_path (str): Path to the cleaned_resume.csv file containing resume_content and Category columns.
        output_csv_path (str): Path to save the merged CSV.

    Returns:
        str: Path to the merged CSV file.
    """
    try:
        # Load the two CSV files
        jd_df = pd.read_csv(jd_csv_path)
        resume_df = pd.read_csv(resume_csv_path)

        # Ensure the required columns exist
        if 'Role' not in jd_df.columns or 'Category' not in resume_df.columns:
            raise ValueError("JD.csv must contain 'Role' and cleaned_resume.csv must contain 'Category' columns.")

        # Filter the resume dataframe for 'Information-Technology' category
        resume_df_filtered = resume_df[resume_df['Category'] == 'INFORMATION-TECHNOLOGY']

        # Merge the dataframes on Role and Category
        merged_df = pd.merge(jd_df, resume_df_filtered, left_on='Role', right_on='Category', how='inner')

        # Save the merged DataFrame to a new CSV file
        merged_df.to_csv(output_csv_path, index=False)

        return f"Merged CSV saved successfully at: {output_csv_path}"

    except Exception as e:
        return f"Error while merging CSVs: {str(e)}"


# Example usage
if __name__ == "__main__":
    jd_csv_path = "JD.csv"  # Path to your JD CSV
    resume_csv_path = "cleaned_resume.csv"  # Path to your cleaned_resume CSV
    output_csv_path = "filtered_testcases.csv"  # Path to save the merged CSV

    result_message = merge_csvs(jd_csv_path, resume_csv_path, output_csv_path)
    print(result_message)
