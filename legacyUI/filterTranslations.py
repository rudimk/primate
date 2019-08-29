# coding: utf-8

import json
import os

with open("olderLayout.json") as outfile:
   olderLayout = json.load(outfile)["allFields"]

newTranslations = {}
for r, d, f in os.walk("l10n"):
    for file in f:
        print file
        if '.js' in file:
            with open(os.path.join(r, file)) as oldfile:                
                oldTrans = json.load(oldfile)
                newTrans = {}
                for apikey in olderLayout:      
                    currLabel = olderLayout[apikey]["labels"][0]  
                    if currLabel in oldTrans:
                        newTrans[apikey] = oldTrans[currLabel]
                newTranslations[file] = newTrans

for file in newTranslations:
    with open("../src/locales/" + file[:-3] + ".json", "w") as newT:
        json.dump(newTranslations[file], newT)
