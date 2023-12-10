## iPhone Photo Renaming Tool

Just a simple tool I wrote to rename files of shots taken on an iOS device according to the android naming scheme for easy migration. It now also changes the file's btime, as Apple somehow doesn't manage to preserve them or just stores them entirely different.

### Usage

* Connect the iPhone to your PC, drag the entire PTP folder onto your computer. Use the directory as src (change variable in code).

* Run the script with `node index.js`

* The script will generate an "OUT" folder inside your src folder, containing all the new files. Inside the OUT folder there will be DCIM, Screenshots and Error.

### The folders

* DCIM will contain your regular photos taken with your iOS device.

* Screenshots usually won't contain many if any pictures due to iOS not providing any creation date metadata to the files 

* Error will contain all the excess: files that don't have metadata or that couldn't be processed by the algorithm.

### Note

* The script will only parse jpg, mov and png files. png's are automatically being associated to Screenshots, which might not be the best, but for me it works.