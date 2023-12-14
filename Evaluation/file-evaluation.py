filename = "Nodes/file-with-Gramine"
f = open(filename, "r")
lines = f.readlines()
writefile_values = []
readfile_values = []


for l in lines: 
    print(l)
    if (l.split(":")[0]=="readfile"):
        readfile_values.append(float(l.split(":")[1].strip("")))
    elif(l.split(":")[0]=="writefile"):
        writefile_values.append(float(l.split(":")[1].strip("")))
print("Avg for ", filename)
print("execution counts for write", len(writefile_values) )
print("Average execution time is " , sum(writefile_values)/len(writefile_values))

print("execution counts for read", len(readfile_values) )
print("Average execution time is " , sum(readfile_values)/len(readfile_values))



