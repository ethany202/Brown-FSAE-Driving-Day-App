import os
import pandas as pd
from data_containers import ldData
from data_chunks import column_data_chunks



def parse_ld_to_csv(ld_file_path: str) -> str:
    """
    Parse an `.ld` file into a `.csv` file.
    
    Args:
        ld_file_path (str): Path to the `.ld` file.

    Returns:
        str: Path to the generated `.csv` file.
    """
    if not ld_file_path.endswith('.ld'):
        raise ValueError("The provided file is not an `.ld` file.")

    # Parse `.ld` file into a DataFrame
    print(f"Parsing {ld_file_path}...")
    l = ldData.fromfile(ld_file_path)
    df = l.to_dataframe()

    # Generate the CSV file path
    csv_file_path = os.path.splitext(ld_file_path)[0] + '.csv'

    # Save DataFrame as a CSV file
    df.to_csv(csv_file_path, index=False)
    print(f"CSV file saved to {csv_file_path}")

    return csv_file_path


def inspect_csv(csv_file_path: str, rows: int = 5):
    """
    Inspect a `.csv` file by printing the first few rows.

    Args:
        csv_file_path (str): Path to the `.csv` file.
        rows (int): Number of rows to preview. Default is 5.

    Returns:
        None
    """
    if not csv_file_path.endswith('.csv'):
        raise ValueError("The provided file is not a `.csv` file.")

    # Load the CSV into a DataFrame
    print(f"Inspecting {csv_file_path}...")
    df = pd.read_csv(csv_file_path)

    # Print a preview of the data
    print(f"Preview of the first {rows} rows:\n{df.head(rows)}")

def filter_valid_rows(csv_file_path: str, output_csv_file_path: str) -> str:
    """
    Filter rows in the CSV file based on the first column until a null value is encountered.
    
    Args:
        csv_file_path (str): Path to the input `.csv` file.
        output_csv_file_path (str): Path to save the filtered `.csv` file.

    Returns:
        str: Path to the filtered `.csv` file.
    """
    if not csv_file_path.endswith('.csv'):
        raise ValueError("The provided file is not a `.csv` file.")

    # Load the CSV into a DataFrame
    print(f"Loading {csv_file_path}...")
    df = pd.read_csv(csv_file_path)

    # Check for null values in the first column
    first_column = df.columns[0]  # Name of the first column
    valid_rows = df[df[first_column].notnull()]  # Filter rows where the first column is not null

    # Stop at the first null value in the first column
    for idx, value in enumerate(df[first_column]):
        if pd.isnull(value):  # Stop processing when a null value is encountered
            valid_rows = df.iloc[:idx]  # Slice up to the first null value
            break

    # Save the valid rows to a new CSV file
    valid_rows.to_csv(output_csv_file_path, index=False)
    print(f"Filtered data saved to {output_csv_file_path}")

    return output_csv_file_path



# The below is used to parse the ld to csv and inspect it:
# ld_file_path = 'data/sample_test.ld'
# csv_file_path = parse_ld_to_csv(ld_file_path)
# inspect_csv(csv_file_path, rows=5)


# The below is used to filter the valid rows in the csv file:
# input_csv = 'data/sample_test.csv'
# output_csv = 'data/valid_sample_test.csv'  
# filtered_csv = filter_valid_rows(input_csv, output_csv)


# Inspect the filtered file
filtered_csv = 'data/valid_sample_test.csv'
inspect_csv(filtered_csv, rows=5)


# Inspect the column data chunks
# input_csv = 'data/valid_sample_test.csv'
# columns = ['Fuel Mixture Aim', 'Temperature']
# filtered_df = column_data_chunks(input_csv, columns)