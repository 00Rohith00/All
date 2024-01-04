// converting a folder into zip folder with unique name

// Required { node } { adm-zip }

const AdmZip = require("adm-zip")

var filename  = Date.now()+".zip"

async function createZipArchive(){
try 
{
    const zip = new AdmZip();
    const outputFile = filename;
    zip.addLocalFolder("./upload");
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully...`);
} 
catch (e) 
{
    console.log(`Something went wrong. ${e}`);
}
}
createZipArchive();
