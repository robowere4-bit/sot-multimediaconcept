export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).end();

  const {name,phone,gender,score,percent}=req.body;

  const text=`📖 SOT Bible Quiz
👤 ${name}
📞 ${phone}
⚥ ${gender}
🏆 Score: ${score}
📊 ${percent}%`;

  await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      chat_id:process.env.TG_CHAT_ID,
      text
    })
  });

  res.status(200).json({ok:true});
}
