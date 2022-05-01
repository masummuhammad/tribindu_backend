import "reflect-metadata";
import {createConnection, getConnection} from "typeorm";
import {Result} from './entity/results';
import {currentResult} from "./entity/currentResult";
import * as express from 'express';
import {} from 'express';
import {ApolloServer} from 'apollo-server-express';
import typeDefs from './gqlSchema';
import resolvers from './resolvers';
import * as bodyParser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import extractor from './extractor';
import * as fs from 'fs';
import * as path from 'path'
import * as  cors from  'cors';
            
         
createConnection().then(async connection => {
    var available=false;
    const runINF=()=>{
   const files=fs.readdirSync('current_results')
   if(files.length!=0 && !available){
    files.forEach(v=>{
        console.log(v)
        extractor(path.join('current_results',v),connection);

        fs.unlink(path.join('current_results',v),err=>console.log('error'))
        available=true;
       })
   }else{
       console.log('Empty')
   }
    const delDB=async()=>{
       if(available){
           await getConnection().createQueryBuilder().delete().from(Result).execute();
           await getConnection().createQueryBuilder().delete().from(currentResult).execute();
          available=false;
       }
    }
    setTimeout(()=>delDB(),1000*60*60*24*15);
   
    }
    setInterval(()=>runINF(),1000*60*30);
    
//extractor('./result_5th_2016_Regu.pdf',connection);
//let cr=await connection.getRepository(currentResult).createQueryBuilder('currentResult').orderBy('currentResult.pass','DESC').take(5).getMany();
//console.log(cr)

let waiting:boolean=true;
let updating:boolean=false;
let upadated:boolean=false;



const app=express();
const server=new ApolloServer({
                typeDefs,
                resolvers,
                context:{
                    results:connection.getRepository(Result),
                    currentResult:connection.getRepository(currentResult),

                }
                });

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/resultStatus',(req:express.Request,res:express.Response)=>{
    res.json({result_status:{waiting:waiting,updating:updating,updated:available}});
})
app.post('/',(req:express.Request,res:express.Response)=>{
    let file=req['files'].filename;
    console.log(file)
    let uploadPath='./current_results/'+file.name;
    file.mv(uploadPath,err=>{
        if(err){
            return res.status(500).send(err);
        }
    })
    res.end('bye')
})


await server.start();
server.applyMiddleware({app});
app.listen({port:8080},()=>console.log('8080 started the server'));
}).catch(error => console.log(error));