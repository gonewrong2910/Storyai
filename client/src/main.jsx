import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App(){
  const [tab,setTab]=useState('image');
  const [prompt,setPrompt]=useState('');
  const [style,setStyle]=useState('Cinematic');
  const [ratio,setRatio]=useState('9:16');
  const [duration,setDuration]=useState('10');
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState('');

  async function generate(){
    if(!prompt.trim()) return setError('Please enter a prompt.');
    setLoading(true); setError(''); setResult(null);
    try{
      const endpoint=tab==='image'?'/api/generate/image':'/api/generate/video';
      const r=await fetch(API+endpoint,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({prompt,style,ratio,duration})
      });
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||'Generation failed');
      setResult(data);
    }catch(e){setError(e.message)}
    finally{setLoading(false)}
  }

  return <div className="app">
    <header><div className="brand"><span className="logo">S</span><div><b>StoryAI</b><small>Studio</small></div></div><span className="badge">AI CREATOR</span></header>
    <main>
      <section className="hero"><p className="eyebrow">CREATE WITH AI</p><h1>Turn your ideas into<br/><span>images & videos.</span></h1><p className="sub">A clean starting point for your own StoryAI generation platform.</p></section>
      <div className="workspace">
        <aside className="panel controls">
          <div className="tabs"><button className={tab==='image'?'active':''} onClick={()=>setTab('image')}>🎨 Image</button><button className={tab==='video'?'active':''} onClick={()=>setTab('video')}>🎬 Video</button></div>
          <label>Prompt</label><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe what you want to create..."/>
          <label>Style</label><select value={style} onChange={e=>setStyle(e.target.value)}><option>Cinematic</option><option>Realistic</option><option>Anime</option><option>3D</option><option>Illustration</option></select>
          <label>Aspect ratio</label><select value={ratio} onChange={e=>setRatio(e.target.value)}><option>9:16</option><option>1:1</option><option>16:9</option></select>
          {tab==='video'&&<><label>Duration</label><select value={duration} onChange={e=>setDuration(e.target.value)}><option value="5">5 sec</option><option value="10">10 sec</option><option value="15">15 sec</option></select></>}
          {error&&<div className="error">{error}</div>}
          <button className="generate" onClick={generate} disabled={loading}>{loading?'Generating…':`Generate ${tab}`}</button>
        </aside>
        <section className="panel preview">
          {!result&&!loading&&<div className="empty"><div className="spark">✦</div><h2>Your creation appears here</h2><p>Enter a prompt and click Generate.</p></div>}
          {loading&&<div className="empty"><div className="spinner"></div><h2>Creating your {tab}…</h2><p>This can take a little while.</p></div>}
          {result?.type==='image'&&<div className="result"><img src={result.url} alt="Generated result"/><a className="download" href={result.url} target="_blank">Open / Download</a></div>}
          {result?.type==='video'&&<div className="result"><video src={result.url} controls/><a className="download" href={result.url} target="_blank">Open / Download</a></div>}
        </section>
      </div>
    </main>
    <footer>StoryAI Studio · Your AI creation workspace</footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);
