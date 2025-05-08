const fs = require('fs');
const path = require('path');

const sourceDir = '/mnt/hdd1/torrents/htransfer/';
const destinationDir = '/mnt/hdd1/torrents/htransfer/';


function moveFiles(directory) {
    // Read the contents of the directory
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        // Iterate over the files and folders
        files.forEach((file) => {
            const filePath = path.join(directory, file);

            fs.stat(filePath, (err, stats) => {// Check if the file is a file or a directory
                if (err) {
                    console.error(err);
                    return;
                }

                if (stats.isFile()) {// Move the file to the destination directory
                    let destinationPath = path.join(destinationDir, file);
                    if (fs.existsSync(destinationPath)) {// Check if the file already exists
                        console.log(`File ${destinationPath} already exists`);
                        console.log('cannot move file: ', filePath);
                        const lastfolder = getLastFolder(filePath);
                        /*
                        

                        console.log(`File ${destinationPath} already exists renaming it to ${lastfolder}-${file}`);

                        destinationPath = path.join(destinationDir, `${lastfolder}-${file}`);*/
                    } else {
                        fs.rename(filePath, destinationPath, (err) => {// Move the file
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`Moved ${filePath} to ${destinationPath}`);
                            }
                        });
                    }
                } else if (stats.isDirectory()) {// Recursively move the files in the subdirectory
                    console.log(`Found a directory: ${filePath}`);
                    moveFiles(filePath);
                }
            });
        });
    });
}

moveFiles(sourceDir);

function getLastFolder(filePath) {
    console.log('Getting last folder for: ', filePath);
    let folders = filePath.split(path.sep);
    console.log(folders);
    //console.log(folders.pop())
    const lastfoler = folders.pop();
    console.log('Last foler found: ', lastfoler)
    return lastfoler;
}