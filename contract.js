
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser').json()
const Web3 = require("web3");

const app=express();
app.use(express.json())
app.use(cors())
const router = express.Router()

const Abi=require('./ABI.json')
  
const initiateTransfer= async (res,recepient,amount)=>{
    const web3 = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
  

      const from="0x8E7a31D2f1298b429f9f5E7e76a5f517EF506Ef7"
  
      const privateKey="395884234ff6b6d5a19630c361505e56aedbffe8b934444060dac8578819b080"
      const gasPrice= await web3.eth.getGasPrice()
      console.log(gasPrice)
  
  
  
    const netId=await web3.eth.net.getId();
    console.log(netId);
  
  
  
    const ReferralContract = new web3.eth.Contract(
      Abi,
      "0x0351a2de18076ce0ab1a3ee2c9d7a6aaec4b0f52"
    );
  
    const tx=ReferralContract.methods.transfer(recepient,web3.utils.toWei(amount.toString(10), 'Ether'));
    const gas= await tx.estimateGas({from})
    const data=tx.encodeABI();
    const transaction= await web3.eth.accounts.signTransaction({
      from,
      to:"0x0351a2de18076ce0ab1a3ee2c9d7a6aaec4b0f52",
      data,
      nonce: await web3.eth.getTransactionCount("0x8E7a31D2f1298b429f9f5E7e76a5f517EF506Ef7"),
      gasPrice, 
      gasLimit: gas,
      chainId:4
  },
  privateKey
  );
  
  const receipt= await web3.eth.sendSignedTransaction(transaction.rawTransaction)
  
  console.log(receipt)
  res.json({ status: 1, receipt: receipt })
  
  }





//Retriving all the Users frim the DB
app.get('/decimals', async (req, res) => {
  try {

    const web3 = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    const ReferralContract = new web3.eth.Contract(
        Abi,
        "0x0351a2de18076ce0ab1a3ee2c9d7a6aaec4b0f52"
      );
      const netId=await web3.eth.net.getId();
    console.log(netId);
    const decim=await ReferralContract.methods.decimals().call();
    
    res.json({ status: 1, decimal: decim })
    
  } catch (e) {
    res.json({ status: 0, message: e })
  }
})





app.post('/send', bodyParser, async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.body.recepient)
        console.log(req.body.amount)
     initiateTransfer(res,req.body.recepient,req.body.amount);
    } catch (e) {
      res.json({ status: 0, message: e })
    }
  })
  



app.listen(process.env.port || 9000,()=>{
    console.log('hello');
});