const errors=require('../errors')

const checkPermissions=(requestUser,resourceUserId)=>{
    // console.log(requestUser,resourceUserId,typeof(resourceUserId),typeof(requestUser))
    if(requestUser.role=='admin') return;
    if(requestUser.id==resourceUserId.toString()) return ;

    throw new errors.UnauthorizedError('Not authorized to access this route')
}

module.exports=checkPermissions;