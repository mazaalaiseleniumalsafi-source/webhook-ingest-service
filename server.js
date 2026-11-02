const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.status(200).json({ service: 'webhook-ingest-service', ok: true });
});

app.post('/api/webhooks/payment',(req,res)=>{
  const secret = process.env.WEBHOOK_SECRET || 'dev-webhook-secret'
  const signatureHeader= req.headers['x-webhook-signature']
  if(!signatureHeader){
    return res.status(401).json({error: 'Invalid webhook signature'})
  }
  const expectedSignature= crypto.createHmac('sha256',secret).update(JSON.stringify(req.body)).digest('hex');
  const expectedBuffer=Buffer.from(expectedSignature,'utf8')
  const clientBuffer=Buffer.from(signatureHeader,'utf8')
  if(expectedBuffer.length!==clientBuffer.length || !crypto.timingSafeEqual(expectedBuffer,clientBuffer)){
    return res.status(401).json({error:'Invalid webhook signature'})
  } 
  return res.status(200).json({verified:true,event:req.body.event})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
