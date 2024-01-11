import { Upload } from '@aws-sdk/lib-storage'
import { S3 } from '@aws-sdk/client-s3'
import AdmZip from 'adm-zip'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import  express from 'express'

const app = express()

const arr = []

const storage = multer.diskStorage({

    destination: 'upload',

    filename: (request, file, callBack) => 
    {
        try 
        {
            const filename = `${request.body.id}_${file.fieldname}_${file.originalname.replace(/\.[^/.]+$/, '')}_${Date.now()}${path.extname(file.originalname)}`

            callBack(null, filename)

            if (file.fieldname === 'profile') 
            {
                request.body.profile = filename
            }
            else if(file.fieldname === 'report')
            {
                arr.push(filename)
                request.body.report = arr
            }
        } 
        catch (error)
        {
            // error handling
            callBack(error)
        }
    }
})

export const uploadProfile = multer({ storage }).single('profile')

export const uploadReport  = multer({ storage }).array('report')

export const removeAllArrayElements = ()=>{ arr.length = 0 }

export const removeProfileFromLocalFolder = async (request, response, next) => 
{
    try
    {
        await fs.promises.unlink(`upload/${request.body.profile}`)
        console.log("Profile file deleted successfully")
    } 
    catch (error)
    {
        console.error("Unable to delete profile file:", error)
    }
}

export const removeReportsFromLocalFolder = async (request, response, next) => 
{
    try 
    {
        const reports = request.body.report

        await Promise.all(reports.map(async (element) => 
        {
            await fs.promises.unlink(`upload/${element}`)
        }))
        
        console.log(`Report file deleted in upload folder successfully`)

        await fs.promises.rm(`${request.localFolderName}`, { recursive: true })
        
        console.log(`Temporary report folder deleted successfully`)

        await fs.promises.unlink(`${request.localFolderName}.zip`)

        console.log(`Temporary zip folder deleted successfully`)

        next()
    } 
    catch (error)
    {
        console.error("Error while removing reports:", error)
    }
}

export const zipReportFiles = async (request, response, next) => 
{
    try 
    {
        const folderName = request.body.id + "_" + Date.now()

        await fs.promises.mkdir(folderName)
        
        console.log(`Temporary Folder created successfully`)

        const reports = request.body.report

        await Promise.all(reports.map(async (element) => 
        {
            const source = `upload/${element}`
            
            const destination = `${folderName}/${element}`

            await fs.promises.copyFile(source, destination)
            
        }))
        
        console.log(`Report files copied successfully`)

        const zip = new AdmZip()
        
        const outputFile = `${folderName}.zip`
        
        zip.addLocalFolder(folderName)
        
        zip.writeZip(outputFile)

        request.localFolderName = folderName
 
        next()
    } 
    catch (error) 
    {
        console.error("Error while zipping report files:", error)
    }
}

const bucketName = 'atre-v3'

const s3 = new S3({
    credentials:
    {
        accessKeyId: 'AKIAU5JBRF44L46P7PMQ',
        secretAccessKey: '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',
    },
    region: 'ap-south-1',
});

export const insertProfileToS3Bucket = async (request, response, next) =>
{
    try 
    {
        const filePath = path.resolve(`upload/${request.body.profile}`)
        const fileStream = fs.createReadStream(filePath)

        await new Upload({
        client: s3,
        params: 
        {
            Bucket: bucketName,
            Key: `Profile/${request.body.profile}`,
            Body: fileStream,
        },
        }).done()

        console.log(`File uploaded successfully`)
    } 
    catch (error) 
    {
        console.error('Unable to upload file:', error)
    }
}

export const insertReportToS3Bucket = async(request,response,next) =>{

    try 
    {
        const filePath = path.resolve(`${request.localFolderName}.zip`)
        const fileStream = fs.createReadStream(filePath)

        await new Upload({
        client: s3,
        params: 
        {
            Bucket: bucketName,
            Key:   `Report/${request.localFolderName}.zip`,
            Body: fileStream,
            

        },
        }).done()

        console.log(`File uploaded successfully`)
        next()
    } 
    catch (error) 
    {
        console.error('Unable to upload file:', error)
    }
}

const fileSend = (request,response,next) =>{ response.send("Got it"); next()}

app.get('/',(request,response)=>{
    response.sendFile(path.resolve('views/html.html'))
});

app.post('/response',uploadProfile,fileSend,insertProfileToS3Bucket,removeProfileFromLocalFolder)

app.listen(3000,()=>{ console.log("server is running ");})

/*

(1) PROFILE:
uploadProfile --> insertProfileToS3Bucket --> removeProfileFromUploadFolder
app.post('/response',uploadProfile,fileSend,insertProfileToS3Bucket,removeProfileFromLocalFolder)

(2) REPORTS:
uploadReport  --> zipReportFiles ---> insertReportToS3Bucket --> removeReportsFromLocalFolder --> removeAllArrayElements
app.post('/response',uploadReport,fileSend,zipReportFiles,insertReportToS3Bucket,removeReportsFromLocalFolder,removeAllArrayElements)

(3) HTML:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=h1, initial-scale=1.0">
    <title>form</title>
</head>
<body>
     <h1>Fill the form HTML</h1>
     <form action="/response" enctype="multipart/form-data" method="post">
        <input type="text" name="id">
        <p>UPLOAD SINGLE FILES</p>
        <input type="file" name = "profile" required>
        <!-- <p>UPLOAD MULTIPLE FILES</p>
        <input type="file" name = "report" required multiple> -->
        <input type="submit" value="submit">
     </form>
</body>
</html>

(4) REQUIRED INPUTS:
ID    = 1234
FILE  = PROFILE or REPORTS

(5) TO RUN THIS CODE:
upload folder
view folder / html.html file

*/