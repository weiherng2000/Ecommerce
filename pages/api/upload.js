import multiparty from 'multiparty';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
const bucketName = 'wh-next-ecommerce';

export default async function handle(req,res)
{
    const form = new multiparty.Form();
    const {fields,files} = await new Promise((resolve,reject) =>{
        form.parse(req,(err, fields, files) =>{
            if(err)
            {
                reject(err);
            }
            resolve({fields,files});
        });
    });
   
    const client = new S3Client({
        region:'ap-southeast-2',
        credentials:{
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    
    //for loop here is to get the list of picture files and change their name.jpg into a random string
    //Date.now() is for random string to be generated
    const links = [];
    for(const file of files.file)
    {
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.' + ext;
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path),
        }));
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
    }

    return res.json({links});
}

//we will parse the data ourselves instead of parsing to json
export const config = {
   
    api:{bodyParser:false},
};
