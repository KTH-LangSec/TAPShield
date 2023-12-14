filename = "Nodes/inject-with-nodejs"
f = open(filename, "r")
lines = f.readlines()
values = []
for l in lines: 
    print(l)
    values.append(float(l.split(":")[1].strip("")))
print("Avg for ", filename)
print("execution counts:", len(values) )
print("Average execution time is " , sum(values)/len(values))

