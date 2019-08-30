# coding: utf-8

import json
import os
import sys

def loadJson(lfile):
    ldata = lfile.read()
    cont = ldata.split("var dictionary =")
    if len(cont) != 2:
        print "Unexpected format for file " + lfile + ". Expected `var dictionary =` from old source code"
        exit(1)
    
    trans = cont[1].strip().replace("\n", "")
    if trans[-1] == ";":
        trans = trans[0: -1]
    return json.loads(trans)
    
def loadTranslations(l10repo):
    with open("olderLayout.json") as outfile:
        olderLayout = json.load(outfile)["allFields"]

    newTranslations = {}
    for r, d, f in os.walk(l10repo):
        for file in f:
            print file
            if '.js' in file:
                with open(os.path.join(r, file)) as oldfile:                
                    oldTrans = loadJson(oldfile)
                    print len(oldTrans.keys())
                    newTrans = {}
                    for apikey in olderLayout:      
                        currLabel = olderLayout[apikey]["labels"][0]  
                        if currLabel in oldTrans:
                            newTrans[apikey] = oldTrans[currLabel]
                    newTranslations[file] = newTrans

    for file in newTranslations:
        with open("../src/locales/" + file[:-3] + ".json", "w") as newT:
            json.dump(newTranslations[file], newT, sort_keys=True, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print "Usage: fileTranslations.py $CLOUDSTACK_CODE_REPO"
        exit(1)

    cldstk = sys.argv[1]
    l10repo = os.path.join(cldstk, "ui/l10n")
    if not os.path.isdir(l10repo):
        print "Invalid translations location sent: " + l10repo + " does not exists"
        exit(1)
    
    loadTranslations(l10repo)
    exit(0)