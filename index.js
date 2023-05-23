const fs = require('fs');
const path = require('path');

function convertSnakeToCamelCase(str) {
    return str.replace(/(?<![A-Z])_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertFileContent(filePath) {
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            console.log(`Error reading file from disk: ${err}`);
        } else {
            const result = convertSnakeToCamelCase(data);
            fs.writeFile(filePath, result, 'utf8', function(err) {
                if (err) {
                    console.log(`Error writing file: ${err}`);
                }
            });
        }
    });
}

function walkDir(dir, ignoreDirs) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && ignoreDirs.includes(f)) {
            return;
        }
        isDirectory ?
            walkDir(dirPath, ignoreDirs) :
            convertFileContent(dirPath);
    });
};

const directoryToConvert = process.argv[2];
const directoriesToIgnore = process.argv.slice(3);

walkDir(directoryToConvert, directoriesToIgnore);