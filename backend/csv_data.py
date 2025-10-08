import csv

def get_csv_data(path:str, period=('01/01/2000','12/31/2018')):
    with open(path, newline='') as file:
        reader = csv.reader(file)
        result = []
        is_in_period = False
        for row in reader:
            # print(row)
            if row[0] == period[1]:
                is_in_period = True
            if row[0] == period[0]:
                is_in_period = False
            if is_in_period:
                result.append(row)

    return result