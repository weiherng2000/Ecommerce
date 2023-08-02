import multiparty from 'multiparty';

export default aysnc function handle(req,res)
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
    
    return res.json('ok');

}
//we will parse the data ourselves instead of parsing to json
export const config = {
   
    api:{bodyParser:false},
};