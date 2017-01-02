exports.returnResponse = function(res,status,isSuccessful,data){
    console.info("Response status:"+status+" Successful:"+isSuccessful);
    if(isSuccessful){
        res.status(status).send({
            result:"ok",
            data:data
        });
    }
    else{
        res.status(status).send({
            result:"fail",
            error:data
        });
        console.info("Error:");
        console.info(data);
    }
};
