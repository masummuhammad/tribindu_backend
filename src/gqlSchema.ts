import {gql} from 'apollo-server-express';

export default gql`
    type Result{
        eiin:Int,
        regulation:Int,
        roll:Int,
        institute:String,
        result:String,
        semester:String,
        district:String,
    }
    type currentResult{
        eiin:Int,
        institute:String,
        district:String,
        semester:String,
        regulation:Int,
        pass:Int,
        fail:Int,
        passingRate:String,
    }
   
    type Query{
        getResult(roll:Int!):Result!,
        getCurrentResultAll:[currentResult]!,
       
    }
    
    
`;
