import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';
import {currentResult} from './entity/currentResult';
import {Result} from './entity/results';

const extractor=async(path,connection)=>{
    var globalCurrentResult=[];
    var globalResult=[]
    let semester=path.match(/([4-8]th)|(\_[4-8]\_)/)[0]
    let regulation=parseInt(path.match(/201[0|6]/gi)[0]);
    let RESULT=connection.getRepository(Result);
    let CURRENT_RESULT=connection.getRepository(currentResult);
fs.readFile(path,async(err,data)=>{
    if(err)
    throw new Error('Failed to open file!');
    const contents=(await pdfParse(data)).text.split('\n');
        
        let passCounter:number=0;
        let failCounter:number=0;
        var institute:string=''
        var eiin:number=0
        var district:string;
        var instituteCounter:number=0;
        
    contents.forEach((value,index)=>{
        
        var tempArray=[];
        //pass
        if(index==contents.length-1){
            //console.log('b')
            let tmpObjCR={institute:institute,eiin:eiin,district:district,pass:passCounter,fail:failCounter,semester:semester,regulation:regulation,passingRate:parseFloat(((passCounter/(passCounter+failCounter))*100).toFixed(1))}
                globalCurrentResult.push(tmpObjCR);
        }
        
        if((value.match(/[0-9]* \- [A-Za-z]*/gi))&& !/Bangladesh Technical Education Board, Dhaka - 1207/gi.test(value)){
            //console.log(value)
            instituteCounter++;
            if(instituteCounter>1){
                
                let tmpObjCR={institute:institute,eiin:eiin,district:district,pass:passCounter,fail:failCounter,semester:semester,regulation:regulation,passingRate:parseFloat(((passCounter/(passCounter+failCounter))*100).toFixed(1))}
                globalCurrentResult.push(tmpObjCR);
                
            }
            let instituteData=value.replace(/[0-9]* \- /,'').split(' ,')
            institute=instituteData[0]
            district=instituteData[1]
            eiin=parseInt(value.split('-')[0])
            passCounter=0;
            failCounter=0;
            
            
            
        }
        if(/[0-9]* \([0-9]\.[0-9][0-9]\)/.test(value)){
            
            tempArray.push(value);
        }
        
           tempArray.forEach(e=>{
            let newArr=e.split(')');
            newArr.pop()
            newArr.forEach(el=>{
                
                let tmp=el.split(' (');
                if(tmp[1]!==undefined){
                    passCounter++;
                }
                let tmpObj={institute:institute,eiin:eiin,district:district,semester:semester,regulation:regulation,roll:parseInt(tmp[0]),result:tmp[1]};
              //console.log(tmpObj);
              globalResult.push(tmpObj);
            })
        })
       //refferred
       if(/[0-9]* \{ [0-9]*/.test(value)){
        let tmparr=value.match(/[0-9]* \{/gi);
            tmparr.forEach(e=>{
                failCounter++;
            let tmpObj={institute:institute,eiin:eiin,district:district,semester:semester,regulation:regulation,roll:parseInt(e.replace(' {','')),result:"failed"}
                globalResult.push(tmpObj);
               //console.log(tmpObj)
                
            })
       }
        
        
        
    })
    
    console.log(globalResult.length)
    console.log(globalCurrentResult.length)
    globalCurrentResult.forEach(async(v,i)=>{
        let cr=new currentResult()
        cr=v;
        await CURRENT_RESULT.save(cr);
    })
    
    globalResult.forEach(async(v,i)=>{
        let res=new Result()
        res=v;
        await RESULT.save(res);
    })
})

}
export default extractor;