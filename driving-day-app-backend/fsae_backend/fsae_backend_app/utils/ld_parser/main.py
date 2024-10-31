import os
from data_containers import ldData  

if __name__ == '__main__':
    directory_path = 'data/ld'  # Input folder containing .ld files
    output_folder = 'data/csv'  # Output folder for CSV files

    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        
        l = ldData.fromfile(file_path)
        df = l.to_dataframe()
        
        csv_filename = os.path.join(output_folder, os.path.splitext(filename)[0] + '.csv')
        
        df.to_csv(csv_filename, index=False)
        print(f"Data saved to {csv_filename}")
