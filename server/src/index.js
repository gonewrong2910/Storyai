import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import {generateVideo} from './providers/videoProvider.js';

const app=express();
app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173'}));
app.use(express.json({limit:'2mb'}));

const openai=process.env.OPENAI_API_KEY?new OpenAI({apiKey:process.env.OPENAI_API_KEY}):null;

app.get('/api/health',(req,res)=>res.json({ok:true,service:'storyai-server'}));

app.post('/api/generate/image',async(req,res)=>{
  try{
    const {prompt,style='Cinematic',ratio='9:16'}=req.body||{};
    if(!prompt?.trim()) return res.status(400).json({error:'Prompt is required.'});
    if(!openai) return res.status(500).json({error:'OPENAI_API_KEY is not configured on the server.'});
    const fullPrompt=`${prompt.trim()}\nStyle: ${style}. Composition: vertical social-media image when aspect ratio is 9:16; square when 1:1; landscape when 16:9. Aspect ratio: ${ratio}.`;
    const response=await openai.images.generate({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',prompt:fullPrompt});
    const item=response.data?.[0];
    if(!item) throw new Error('No image returned.');
    if(item.url) return res.json({type:'image',url:item.url});
    if(item.b64_json) return res.json({type:'image',url:`data:image/png;base64,${item.b64_json}`});
    throw new Error('Image response did not contain a usable result.');
  }catch(err){console.error(err);res.status(500).json({error:err.message||'Image generation failed.'})}
});

app.post('/api/generate/video',async(req,res)=>{
  try{
    const {prompt,style='Cinematic',ratio='9:16',duration='10'}=req.body||{};
    if(!prompt?.trim()) return res.status(400).json({error:'Prompt is required.'});
    const result=await generateVideo({prompt,style,ratio,duration});
    res.json({type:'video',...result});
  }catch(err){res.status(500).json({error:err.message||'Video generation failed.'})}
});

const port=process.env.PORT||4000;
app.listen(port,()=>console.log(`StoryAI server running on http://localhost:${port}`));
