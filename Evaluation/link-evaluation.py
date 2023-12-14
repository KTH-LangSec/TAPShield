filename = "Nodes/link-with-nodejs"
f = open(filename, "r")
lines = f.readlines()
linkin_values = []
linkcall_values = []
linkout_values = []

for l in lines: 
    print(l)
    if (l.split(":")[0]=="Linkin"):
        linkin_values.append(float(l.split(":")[1].strip("")))
    elif(l.split(":")[0]=="Linkcall"):
        linkcall_values.append(float(l.split(":")[1].strip("")))
    elif(l.split(":")[0]=="Linkout"):
        linkout_values.append(float(l.split(":")[1].strip("")))
print("Avg for ", filename)
print("execution counts for linkin", len(linkin_values) )
print("Average execution time is " , sum(linkin_values)/len(linkin_values))

print("execution counts for linkcall", len(linkcall_values) )
print("Average execution time is " , sum(linkcall_values)/len(linkcall_values))

print("execution counts for linkout", len(linkout_values) )
print("Average execution time is " , sum(linkout_values)/len(linkout_values))


