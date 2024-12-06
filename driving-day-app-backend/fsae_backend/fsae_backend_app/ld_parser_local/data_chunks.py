import pandas as pd


def load_csv(csv_file_path: str) -> pd.DataFrame:
    """
    Load a valid CSV file into a pandas DataFrame.

    Args:
        csv_file_path (str): Path to the CSV file.

    Returns:
        pd.DataFrame: Loaded DataFrame.
    """
    if not csv_file_path.endswith('.csv'):
        raise ValueError("The provided file is not a `.csv` file.")

    print(f"Loading {csv_file_path}...")
    df = pd.read_csv(csv_file_path)
    print(f"Loaded {len(df)} rows and {len(df.columns)} columns.")
    return df


def filter_columns(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """
    Filter the DataFrame to only include the specified columns.

    Args:
        df (pd.DataFrame): Input DataFrame.
        columns (list): List of column names to include.

    Returns:
        pd.DataFrame: Filtered DataFrame.
    """
    if not all(col in df.columns for col in columns):
        raise ValueError("Some columns in the list are not present in the DataFrame.")

    print(f"Filtering columns: {columns}")
    filtered_df = df[columns]
    print(f"Filtered DataFrame contains {len(filtered_df)} rows and {len(filtered_df.columns)} columns.")
    return filtered_df


def inspect_dataframe(df: pd.DataFrame, rows: int = 5):
    """
    Inspect the first few rows of a DataFrame.

    Args:
        df (pd.DataFrame): DataFrame to inspect.
        rows (int): Number of rows to preview. Default is 5.

    Returns:
        None
    """
    print(f"Previewing the first {rows} rows of the DataFrame:")
    print(df.head(rows))


def column_data_chunks(csv_file_path: str, columns: list, rows_to_inspect: int = 5):
    """
    Combined function to load a CSV, filter specific columns, and inspect the filtered DataFrame.

    Args:
        csv_file_path (str): Path to the input CSV file.
        columns (list): List of column names to filter.
        rows_to_inspect (int): Number of rows to preview in the inspection. Default is 5.

    Returns:
        pd.DataFrame: The filtered DataFrame for further use.
    """
    df = load_csv(csv_file_path)  # Load the CSV into a DataFrame
    filtered_df = filter_columns(df, columns)  # Filter the desired columns
    inspect_dataframe(filtered_df, rows=rows_to_inspect)  # Inspect the filtered DataFrame
    return filtered_df
