import sys
import glob
from .data_containers import ldData

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: ldparser.py /some/path/")
        exit(1)

    for f in glob.glob(f'{sys.argv[1]}/*.ld'):
        l = ldData.fromfile(f)
        df = l.to_dataframe()
        df.to_csv('sample.csv', index=False)
        print("Data saved to sample.csv")