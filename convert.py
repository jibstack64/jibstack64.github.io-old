# converts all vw values in IN to OUT by FACTOR
# lazy, im aware

import re

FACTOR = 3
IN = "styles.css"
OUT = "mobile.css"

final = ""
with open(IN, "r") as f:
    data = f.read()
    #data = "5vw 100vw 1.23vw"
    instances = re.findall("[0-9|.]*vw", data)
    ignore = []
    for x in instances:
        if x in ignore:
            continue
        v = str(float(x[0:-2]) * FACTOR) + "vw"
        print("ONCE: " + x + "; NOW: " + v)
        ignore.append(x)
        data = data.replace(x, v)
    final = data
    f.close()

with open(OUT, "w") as f:
    f.write(final)
    f.close()
