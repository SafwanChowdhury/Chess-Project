filename = "input.txt"

with open(filename, "r") as file:
    input_string = file.read()

output_list = []
for line in input_string.split("\n"):
    if "," in line:
        x, y = line.split(",")
        output_list.append([int(x), int(y)])

print(output_list)

with open("movesLog.txt", "w") as file:
    file.write(str(output_list))
