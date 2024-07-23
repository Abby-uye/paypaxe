const Notfound =(req,res)=>{
    return res.status(404).send('Not Found');
};
module.exports = Notfound;