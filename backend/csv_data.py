import csv
def get_csv_data(path:str):
    with open(path, newline='') as file:
        reader = csv.reader(file)
        result = ""
        for row in reader:
            result += str(row) + "\n"
    return result