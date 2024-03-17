

const Success = (msg,statusCode)=>{
    return {
        status:"ok",
        statusCode,
        msg
    }
}


const Error = (msg,statusCode)=>{
    return {
        status:"error",
        statusCode,
        msg
    }
}

module.exports = {Success,Error}