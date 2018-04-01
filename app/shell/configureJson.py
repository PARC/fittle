import os
from shutil import copyfile

cwd = os.getcwd()
print ("Running %s at %s"%('configureJson.py',cwd))

inputpath =  os.path.join(cwd, 'public/content')
outputpath = os.path.join(cwd, 'private/content')

print ("Copying %s to %s"%(inputpath,outputpath))

for dirpath, dirnames, filenames in os.walk(os.path.join(cwd,'public/content')):
    structure = "%s%s"%(outputpath, dirpath[len(inputpath):])
    if not os.path.isdir(structure):
        print("Creating %s"%structure)
        os.mkdir(structure)
    else:
        print("Folder: %s"%structure)
    for file in filenames:
        filename, file_extension = os.path.splitext(file)
        if file_extension == '.json':
            src = "%s/%s"%(dirpath,file)
            dst = "%s/%s"%(structure,file)
            print("Copy %s to %s"%(src,dst))
            copyfile(src,dst)
