export async function generateVideo({prompt,style,ratio,duration}){
  const url=process.env.VIDEO_PROVIDER_URL;
  const key=process.env.VIDEO_PROVIDER_API_KEY;
  if(!url) throw new Error('VIDEO_PROVIDER_URL is not configured. Add your video-generation provider endpoint in server/.env and adapt this adapter to its API format.');
  const response=await fetch(url,{
    method:'POST',
    headers:{'Content-Type':'application/json',...(key?{'Authorization':`Bearer ${key}`}:{})},
    body:JSON.stringify({prompt,style,aspect_ratio:ratio,duration})
  });
  const text=await response.text();
  let data; try{data=JSON.parse(text)}catch{data={raw:text}};
  if(!response.ok) throw new Error(data.error||data.message||`Video provider returned ${response.status}`);
  const videoUrl=data.url||data.video_url||data.output?.url;
  if(!videoUrl) throw new Error('Video provider response has no url. Update videoProvider.js for your provider.');
  return {url:videoUrl};
}
