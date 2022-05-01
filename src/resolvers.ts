
export default {
        Query:{
            
            getResult:async(parent,{roll},{results})=>{
                
                const result=await results.find({roll:roll});
                return result[0];
                
            },
            getCurrentResultAll:async(parent,args,{currentResult})=>{
                
                const currentAll= await currentResult.createQueryBuilder('currentResult')
                .orderBy('currentResult.pass','DESC').getMany();
                
                return currentAll;
               
            }
        },
        

        
}