/**
 * KICKS & FINDS — pages/index.jsx
 * Next.js + Tailwind (uses inline styles for portability)
 *
 * SETUP:
 * 1. npm install lucide-react
 * 2. Put your logo at: public/logo.jpg
 * 3. Set SHEETS_URL below to your deployed Apps Script Web App URL
 * 4. Set ADMIN_PIN below
 * 5. npm run dev  →  vercel deploy
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart, MessageCircle, Clock, CheckCircle, XCircle,
  Edit2, Trash2, Plus, X, Check, Upload, ChevronDown,
  Search, ShoppingBag, Tag, Settings, LogOut
} from "lucide-react";

// ── CONFIG ──────────────────────────────────────────────────────────────────
const SHEETS_URL  = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"; // paste after deploying
const ADMIN_PIN   = "1234";  // change this
const WHATSAPP    = "254700000000"; // default; overridden per-product

// ── HELPERS ─────────────────────────────────────────────────────────────────
const fmt    = p  => "KES " + Number(p).toLocaleString();
const ago    = d  => { const s=(Date.now()-new Date(d))/1e3; if(s<60)return"just now"; if(s<3600)return Math.floor(s/60)+"m ago"; if(s<86400)return Math.floor(s/3600)+"h ago"; return Math.floor(s/86400)+"d ago"; };
const waLink = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
const toB64  = file => new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });

// ── API LAYER ────────────────────────────────────────────────────────────────
async function api(action, body={}) {
  if (action === "getProducts" || action === "getCategories") {
    const r = await fetch(`${SHEETS_URL}?action=${action}`);
    return r.json();
  }
  const r = await fetch(SHEETS_URL, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ action, ...body })
  });
  return r.json();
}

async function uploadImage(file) {
  const base64   = await toB64(file);
  const mimeType = file.type;
  const fileName = file.name;
  return api("uploadImage", { base64, mimeType, fileName });
}

// ─── LOCAL DEMO DATA (used when SHEETS_URL is not set) ──────────────────────
const DEMO_PRODUCTS = [
  { id:1, name:"Birkenstock Amsterdam Wool Clogs", brand:"Birkenstock", price:4500, category:"Clogs", condition:"Used – Good", available:true, postedAt:"2026-04-16T08:00:00", images:["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80"], description:"Dark grey wool felt Birkenstock Amsterdam clogs. Cork footbed with natural leather lining.", whatsapp:WHATSAPP },
  { id:2, name:"Nike Air Force 1 Triple Black", brand:"Nike", price:6500, category:"Sneakers", condition:"Used – Very Good", available:true, postedAt:"2026-04-16T07:30:00", images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"], description:"All-black Nike Air Force 1 Low. Clean leather upper with shoe trees included.", whatsapp:WHATSAPP },
  { id:3, name:"Nike Court Legacy White Canvas", brand:"Nike", price:5800, category:"Sneakers", condition:"Used – Good", available:true, postedAt:"2026-04-15T19:00:00", images:["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80"], description:"White canvas Nike Court Legacy. Retro low-profile silhouette with gold script logo.", whatsapp:WHATSAPP },
  { id:4, name:"Black Patent Penny Loafers", brand:"Unbranded", price:3200, category:"Loafers", condition:"Used – Good", available:false, postedAt:"2026-04-15T14:00:00", images:["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80"], description:"High-shine black patent leather penny loafers.", whatsapp:WHATSAPP },
  { id:5, name:"Chunky Horsebit Loafers", brand:"Unbranded", price:7500, category:"Loafers", condition:"Used – Excellent", available:true, postedAt:"2026-04-15T12:00:00", images:["https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52?w=600&q=80"], description:"Black leather chunky lug-sole loafers with gold horsebit hardware. Very lightly worn.", whatsapp:WHATSAPP },
  { id:6, name:"Adidas Sabalo Red Suede", brand:"Adidas", price:5500, category:"Sneakers", condition:"Used – Good", available:true, postedAt:"2026-04-15T10:00:00", images:["https://images.unsplash.com/photo-1578116922645-3976907a7671?w=600&q=80"], description:"Burnt red suede Adidas Sabalo with clean white cupsole. A rare colourway.", whatsapp:WHATSAPP },
];
const DEMO_CATS = ["Sneakers","Loafers","Clogs","Bags","Accessories"];
const USE_DEMO  = !SHEETS_URL || SHEETS_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

// ─── TOAST ───────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = useCallback(m => { setMsg(m); setTimeout(()=>setMsg(null), 2500); }, []);
  return [msg, show];
}

// ─── IMAGE CAROUSEL ──────────────────────────────────────────────────────────
function ProductImages({ images=[], available, name }) {
  const [idx, setIdx] = useState(0);
  const n = images.length;
  return (
    <div style={{ position:"relative", paddingBottom:"125%", background:"#f0ede8", overflow:"hidden" }}>
      {n ? (
        <img src={images[idx]} alt={name}
          style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",
            filter: available?"none":"grayscale(100%) brightness(.7)",
            transition:"transform .4s" }}
          onMouseEnter={e=>e.target.style.transform="scale(1.04)"}
          onMouseLeave={e=>e.target.style.transform="scale(1)"}
        />
      ) : (
        <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>👟</div>
      )}
      {!available && (
        <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ background:"#c0392b",color:"#fff",fontWeight:700,fontSize:12,letterSpacing:".15em",padding:"5px 16px",textTransform:"uppercase",borderRadius:3 }}>SOLD</span>
        </div>
      )}
      {n>1 && <>
        <button onClick={()=>setIdx(i=>(i-1+n)%n)} style={{ position:"absolute",left:0,top:0,bottom:0,width:"30%",background:"none",border:"none",cursor:"pointer" }}/>
        <button onClick={()=>setIdx(i=>(i+1)%n)}   style={{ position:"absolute",right:0,top:0,bottom:0,width:"30%",background:"none",border:"none",cursor:"pointer" }}/>
        <div style={{ position:"absolute",bottom:9,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4 }}>
          {images.map((_,i)=>(
            <button key={i} onClick={()=>setIdx(i)}
              style={{ height:5,width:i===idx?15:5,borderRadius:3,background:i===idx?"#fff":"rgba(255,255,255,.5)",border:"none",cursor:"pointer",transition:"all .18s",padding:0 }}/>
          ))}
        </div>
      </>}
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product:p, adminMode, onEdit, onDelete }) {
  const [liked, setLiked] = useState(false);
  const waMsg   = `Hi! I'm interested in the *${p.name}* listed at *${fmt(p.price)}*. Is it still available? 👟`;
  const lipaMsg = `Hi! I'd like to book the *${p.name}* (${fmt(p.price)}) on Lipa Pole Pole. What's the deposit? 🙏`;
  const num = p.whatsapp || WHATSAPP;

  return (
    <div style={{ background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 14px rgba(0,0,0,.07)",display:"flex",flexDirection:"column",transition:"box-shadow .22s,transform .22s" }}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.13)";e.currentTarget.style.transform="translateY(-3px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 14px rgba(0,0,0,.07)";e.currentTarget.style.transform="translateY(0)"}}>
      <div style={{ position:"relative" }}>
        <ProductImages images={p.images||[]} available={p.available} name={p.name}/>
        <button onClick={()=>setLiked(l=>!l)}
          style={{ position:"absolute",top:11,right:11,background:"rgba(255,255,255,.92)",backdropFilter:"blur(4px)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,.12)",transition:"transform .15s" }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.18)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <Heart size={16} fill={liked?"#e74c3c":"none"} color={liked?"#e74c3c":"#555"}/>
        </button>
        <div style={{ position:"absolute",top:11,left:11,background:"rgba(255,255,255,.93)",backdropFilter:"blur(4px)",borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:600,color:"#333",letterSpacing:".04em" }}>
          {p.condition}
        </div>
      </div>

      <div style={{ padding:"15px 17px 18px",flex:1,display:"flex",flexDirection:"column",gap:9 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontSize:11,fontWeight:700,color:"#c8a96e",textTransform:"uppercase",letterSpacing:".12em" }}>{p.brand}</span>
          <span style={{ fontSize:11,color:"#bbb",display:"flex",alignItems:"center",gap:3 }}><Clock size={10}/> {ago(p.postedAt)}</span>
        </div>
        <h3 style={{ margin:0,fontSize:15,fontFamily:"'Playfair Display',serif",fontWeight:600,color:"#1a1a1a",lineHeight:1.35 }}>{p.name}</h3>
        <p style={{ margin:0,fontSize:12.5,color:"#888",lineHeight:1.6 }}>{p.description}</p>
        <div style={{ display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:p.available?"#2d6a4f":"#c0392b" }}>
          {p.available ? <><CheckCircle size={13}/> Available</> : <><XCircle size={13}/> Sold</>}
        </div>
        <span style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1a1a1a" }}>{fmt(p.price)}</span>

        {adminMode ? (
          <div style={{ display:"flex",gap:7,marginTop:4 }}>
            <button onClick={()=>onEdit(p)} style={{ flex:1,padding:"9px",background:"#f7f4f0",border:"1.5px solid #e8e4df",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:"#555",display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
              <Edit2 size={13}/> Edit
            </button>
            <button onClick={()=>onDelete(p.id)} style={{ flex:1,padding:"9px",background:"#fff0f0",border:"1.5px solid #f5c6c6",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:"#c0392b",display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
              <Trash2 size={13}/> Delete
            </button>
          </div>
        ) : p.available && (
          <div style={{ display:"flex",gap:8,marginTop:4 }}>
            <a href={waLink(num,waMsg)} target="_blank" rel="noopener noreferrer"
              style={{ flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#25D366",color:"#fff",borderRadius:10,padding:"11px 0",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,textDecoration:"none" }}>
              <MessageCircle size={14}/> Enquire
            </a>
            <a href={waLink(num,lipaMsg)} target="_blank" rel="noopener noreferrer"
              style={{ flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:5,background:"#1a1a1a",color:"#c8a96e",borderRadius:10,padding:"11px 0",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:12,textDecoration:"none",border:"1.5px solid #2d2d2d" }}>
              💳 Lipa Pole Pole
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT FORM (drawer) ────────────────────────────────────────────────────
const CONDITIONS = ["Used – Excellent","Used – Very Good","Used – Good","Used – Fair","Brand New"];

function ProductDrawer({ product, categories, onSave, onClose, uploading, setUploading }) {
  const [form, setForm] = useState({
    name:"", brand:"", category: categories[0]||"", condition:"Used – Good",
    price:"", description:"", available:true, whatsapp:WHATSAPP, images:[]
  });
  const [previews, setPreviews] = useState([]);
  const fileRef = useRef();

  useEffect(()=>{
    if (product) {
      setForm({ ...product, price: String(product.price), images: product.images||[] });
      setPreviews(product.images||[]);
    } else {
      setForm({name:"",brand:"",category:categories[0]||"",condition:"Used – Good",price:"",description:"",available:true,whatsapp:WHATSAPP,images:[]});
      setPreviews([]);
    }
  }, [product]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function handleFiles(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    let newPreviews=[...previews], newImages=[...form.images];
    for (const file of files) {
      if (newImages.length>=10) break;
      if (USE_DEMO) {
        const b64 = await toB64(file);
        newPreviews.push(b64); newImages.push(b64);
      } else {
        const res = await uploadImage(file);
        if (res.url) { newPreviews.push(res.url); newImages.push(res.url); }
      }
    }
    setPreviews(newPreviews); set("images",newImages);
    setUploading(false);
    e.target.value="";
  }

  function removePhoto(i) {
    const p=[...previews]; p.splice(i,1); setPreviews(p);
    const imgs=[...form.images]; imgs.splice(i,1); set("images",imgs);
  }

  function handleSave() {
    if (!form.name||!form.brand||!form.price) return alert("Name, Brand & Price are required");
    onSave({ ...form, price: parseFloat(form.price) });
  }

  const inp = (id, label, type="text", extra={}) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:5 }}>{label}</label>
      <input id={id} type={type} value={form[id]||""} onChange={e=>set(id,e.target.value)}
        style={{ width:"100%",padding:"10px 13px",border:"1.5px solid #e8e4df",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none" }}
        {...extra}/>
    </div>
  );

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:300,display:"flex",alignItems:"flex-start",justifyContent:"flex-end" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff",width:"min(480px,100vw)",height:"100vh",overflowY:"auto",boxShadow:"-8px 0 40px rgba(0,0,0,.18)",display:"flex",flexDirection:"column" }}>
        {/* Header */}
        <div style={{ background:"#1a1a1a",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10 }}>
          <span style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:"#fff",fontWeight:700 }}>{product?"Edit Product":"Add Product"}</span>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#888",fontSize:22,cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:24,flex:1,overflowY:"auto" }}>

          {/* Photos */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:11,fontWeight:700,color:"#c8a96e",textTransform:"uppercase",letterSpacing:".14em",marginBottom:14,paddingBottom:6,borderBottom:"1px solid #e8e4df" }}>📸 Product Photos</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:10 }}>
              {previews.map((src,i)=>(
                <div key={i} style={{ position:"relative",width:72,height:72,borderRadius:8,overflow:"hidden",border:"1.5px solid #e8e4df" }}>
                  <img src={src} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                  <button onClick={()=>removePhoto(i)} style={{ position:"absolute",top:2,right:2,background:"rgba(0,0,0,.65)",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
                </div>
              ))}
            </div>
            <div onClick={()=>fileRef.current.click()} style={{ border:"2px dashed #e8e4df",borderRadius:12,padding:"18px 20px",textAlign:"center",cursor:"pointer" }}>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleFiles}/>
              <Upload size={22} color="#c8a96e" style={{ margin:"0 auto 6px" }}/>
              <div style={{ fontSize:13,color:"#aaa" }}>{uploading?"Uploading…":"Tap to upload photos"}</div>
              <div style={{ fontSize:11,color:"#ccc",marginTop:2 }}>JPG, PNG · up to 10 images</div>
            </div>
          </div>

          {/* Details */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:11,fontWeight:700,color:"#c8a96e",textTransform:"uppercase",letterSpacing:".14em",marginBottom:14,paddingBottom:6,borderBottom:"1px solid #e8e4df" }}>📋 Details</div>
            {inp("name","Product Name *",  "text",{placeholder:"e.g. Nike Air Force 1"})}
            {inp("brand","Brand *",         "text",{placeholder:"e.g. Nike"})}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
              <div>
                <label style={{ display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:5 }}>Category *</label>
                <select value={form.category} onChange={e=>set("category",e.target.value)}
                  style={{ width:"100%",padding:"10px 13px",border:"1.5px solid #e8e4df",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none" }}>
                  {categories.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:5 }}>Condition</label>
                <select value={form.condition} onChange={e=>set("condition",e.target.value)}
                  style={{ width:"100%",padding:"10px 13px",border:"1.5px solid #e8e4df",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none" }}>
                  {CONDITIONS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:5 }}>Description</label>
              <textarea value={form.description||""} onChange={e=>set("description",e.target.value)} rows={4}
                placeholder="Describe condition, size notes, unique details…"
                style={{ width:"100%",padding:"10px 13px",border:"1.5px solid #e8e4df",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none",resize:"vertical" }}/>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:11,fontWeight:700,color:"#c8a96e",textTransform:"uppercase",letterSpacing:".14em",marginBottom:14,paddingBottom:6,borderBottom:"1px solid #e8e4df" }}>💰 Pricing & Status</div>
            {inp("price","Price (KES) *","number",{placeholder:"5000"})}
            {inp("whatsapp","WhatsApp (with country code)","text",{placeholder:"254700000000"})}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#f7f4f0",borderRadius:9 }}>
              <span style={{ fontSize:13,fontWeight:600,color:"#444" }}>Available for sale</span>
              <input type="checkbox" checked={form.available} onChange={e=>set("available",e.target.checked)}
                style={{ width:44,height:24,accentColor:"#2d6a4f",cursor:"pointer" }}/>
            </div>
          </div>

          <div style={{ display:"flex",gap:10,paddingTop:16,borderTop:"1px solid #e8e4df" }}>
            <button onClick={onClose} style={{ flex:1,background:"#f7f4f0",color:"#555",border:"none",borderRadius:10,padding:13,fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,cursor:"pointer" }}>Cancel</button>
            <button onClick={handleSave} style={{ flex:2,background:"#1a1a1a",color:"#c8a96e",border:"none",borderRadius:10,padding:13,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer" }}>Save Product ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY MANAGER ────────────────────────────────────────────────────────
function CategoryManager({ categories, onAdd, onRemove, onClose }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff",borderRadius:18,padding:"28px 26px",width:"min(380px,92vw)",maxHeight:"80vh",overflowY:"auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:20,color:"#1a1a1a" }}>Manage Categories</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888" }}>✕</button>
        </div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:16 }}>
          {categories.map(c=>(
            <div key={c} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:"#f0ede8",borderRadius:20,fontSize:12,fontWeight:600,color:"#555" }}>
              {c}
              <button onClick={()=>onRemove(c)} style={{ background:"none",border:"none",color:"#c0392b",cursor:"pointer",fontSize:14,lineHeight:1 }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&val.trim()&&(onAdd(val.trim()),setVal(""))}
            placeholder="New category…" style={{ flex:1,padding:"9px 13px",border:"1.5px solid #e8e4df",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none" }}/>
          <button onClick={()=>val.trim()&&(onAdd(val.trim()),setVal(""))}
            style={{ background:"#1a1a1a",color:"#c8a96e",border:"none",borderRadius:9,padding:"9px 16px",fontWeight:700,fontSize:13,cursor:"pointer" }}>Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function KicksAndFinds() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState(DEMO_CATS);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");
  const [adminMode,  setAdminMode]  = useState(false);
  const [pinVal,     setPinVal]     = useState("");
  const [pinErr,     setPinErr]     = useState(false);
  const [showPin,    setShowPin]    = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editProduct,setEditProduct]= useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [catMgr,     setCatMgr]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [toast,      showToast]     = useToast();

  // Load data
  useEffect(()=>{
    if (USE_DEMO) { setProducts(DEMO_PRODUCTS); setLoading(false); return; }
    Promise.all([api("getProducts"), api("getCategories")])
      .then(([prods,cats])=>{ setProducts(prods); if(Array.isArray(cats)) setCategories(cats); })
      .finally(()=>setLoading(false));
  },[]);

  // Sorted newest first
  const sorted   = [...products].sort((a,b)=>new Date(b.postedAt)-new Date(a.postedAt));
  const filtered = sorted.filter(p=>{
    const ms = p.name.toLowerCase().includes(search.toLowerCase())||p.brand.toLowerCase().includes(search.toLowerCase());
    const mc = filter==="All"||p.category===filter;
    return ms&&mc;
  });

  // Admin auth
  function submitPin() {
    if (pinVal===ADMIN_PIN) { setAdminMode(true);setShowPin(false);setPinVal("");setPinErr(false);showToast("Admin mode enabled 🔓"); }
    else { setPinErr(true); }
  }

  // CRUD
  async function handleSave(data) {
    if (editProduct) {
      const updated = { ...editProduct, ...data };
      setProducts(ps=>ps.map(p=>p.id===updated.id?updated:p));
      if (!USE_DEMO) await api("updateProduct", updated);
      showToast("Product updated ✓");
    } else {
      const newP = { ...data, id: Date.now(), postedAt: new Date().toISOString() };
      setProducts(ps=>[newP,...ps]);
      if (!USE_DEMO) await api("addProduct", newP);
      showToast("Product added ✓");
    }
    setDrawerOpen(false); setEditProduct(null);
  }

  async function handleDelete(id) {
    setProducts(ps=>ps.filter(p=>p.id!==id));
    if (!USE_DEMO) await api("deleteProduct",{id});
    setDeletingId(null); showToast("Listing deleted");
  }

  async function handleAddCat(c) {
    if (categories.includes(c)) return;
    setCategories(cs=>[...cs,c]);
    if (!USE_DEMO) await api("addCategory",{category:c});
  }
  async function handleRemoveCat(c) {
    setCategories(cs=>cs.filter(x=>x!==c));
    if (filter===c) setFilter("All");
    if (!USE_DEMO) await api("delCategory",{category:c});
  }

  return (
    <div style={{ minHeight:"100vh",background:"#f7f4f0",fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .card-in{animation:fadeUp .4s ease both;}
      `}</style>

      {/* HEADER */}
      <header style={{ background:"#1a1a1a",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 24px rgba(0,0,0,.28)" }}>
        <div style={{ maxWidth:1140,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:68 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <img src="/logo.jpg" alt="Logo" style={{ width:48,height:48,borderRadius:"50%",objectFit:"cover",border:"2px solid #c8a96e",boxShadow:"0 0 12px rgba(200,169,110,.4)" }} onError={e=>e.target.style.display="none"}/>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:800,color:"#fff",letterSpacing:"-.02em" }}>
                Kicks <span style={{ color:"#c8a96e" }}>&</span> Finds
              </div>
              <div style={{ fontSize:10,color:"#666",letterSpacing:".16em",textTransform:"uppercase" }}>Pre-loved · Mombasa</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:12,color:"#777",fontWeight:600 }}>{filtered.length} items</span>
            {adminMode && (
              <button onClick={()=>setCatMgr(true)} style={{ background:"none",border:"1.5px solid #444",borderRadius:8,padding:"6px 12px",color:"#888",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
                <Tag size={12} style={{ verticalAlign:"middle",marginRight:4 }}/>Cats
              </button>
            )}
            <button onClick={()=>adminMode?setAdminMode(false):setShowPin(true)}
              style={{ padding:"7px 16px",borderRadius:8,fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all .2s",
                border:"1.5px solid",borderColor:adminMode?"#c8a96e":"#444",
                background:adminMode?"#c8a96e":"transparent",color:adminMode?"#1a1a1a":"#888" }}>
              {adminMode?"✏️ Editing":"Admin"}
            </button>
          </div>
        </div>
      </header>

      <div style={{ background:"linear-gradient(135deg,#1a1a1a 0%,#2d2420 100%)",padding:"14px 20px",textAlign:"center" }}>
        <p style={{ color:"#c8a96e",fontSize:12,letterSpacing:".2em",textTransform:"uppercase" }}>✦ Fresh drops · Lipa Pole Pole available · DM to cop ✦</p>
      </div>

      {/* CONTROLS */}
      <div style={{ maxWidth:1140,margin:"0 auto",padding:"22px 20px 0",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center" }}>
        <div style={{ flex:1,minWidth:200,position:"relative" }}>
          <Search size={15} style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#bbb" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search shoes, bags…"
            style={{ width:"100%",padding:"11px 14px 11px 38px",border:"1.5px solid #e8e4df",borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:14,background:"#fff",outline:"none" }}/>
        </div>
        <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
          {["All",...categories].map(c=>(
            <button key={c} onClick={()=>setFilter(c)}
              style={{ padding:"8px 16px",borderRadius:20,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:12.5,transition:"all .18s",
                border:`1.5px solid ${c===filter?"#c8a96e":"#e0dbd4"}`,background:c===filter?"#c8a96e":"#fff",color:c===filter?"#1a1a1a":"#777" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {adminMode && (
        <div style={{ maxWidth:1140,margin:"10px auto 0",padding:"0 20px" }}>
          <div style={{ background:"#fff8ec",border:"1.5px dashed #c8a96e",borderRadius:10,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ fontSize:13,color:"#9a6f28",fontWeight:600 }}>✏️ Admin mode — edit any listing or add new products</span>
            <button onClick={()=>{setEditProduct(null);setDrawerOpen(true);}}
              style={{ background:"#1a1a1a",color:"#c8a96e",border:"none",borderRadius:8,padding:"8px 18px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
              <Plus size={14}/> Add Product
            </button>
          </div>
        </div>
      )}

      <main style={{ maxWidth:1140,margin:"0 auto",padding:"22px 20px 60px" }}>
        {loading ? (
          <div style={{ textAlign:"center",padding:"80px 0",color:"#bbb",fontFamily:"'Playfair Display',serif",fontSize:20 }}>Loading…</div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:"center",padding:"80px 0",color:"#bbb",fontFamily:"'Playfair Display',serif",fontSize:22 }}>No items found 👟</div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(266px,1fr))",gap:22 }}>
            {filtered.map((p,i)=>(
              <div key={p.id} className="card-in" style={{ animationDelay:`${i*.07}s` }}>
                <ProductCard product={p} adminMode={adminMode}
                  onEdit={p=>{setEditProduct(p);setDrawerOpen(true);}}
                  onDelete={id=>setDeletingId(id)}/>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ background:"#1a1a1a",padding:"28px 20px",textAlign:"center" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:"#c8a96e",marginBottom:6 }}>Kicks <span style={{ color:"#fff" }}>&</span> Finds</div>
        <div style={{ color:"#555",fontSize:12 }}>Pre-loved footwear & finds · Mombasa, Kenya</div>
      </footer>

      {/* PIN MODAL */}
      {showPin && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setShowPin(false)}>
          <div style={{ background:"#fff",borderRadius:18,padding:"36px 32px",width:"min(340px,92vw)",boxShadow:"0 20px 60px rgba(0,0,0,.25)" }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,color:"#1a1a1a",marginBottom:6 }}>Admin Access</h3>
            <p style={{ color:"#999",fontSize:13,marginBottom:18 }}>Enter PIN to manage products</p>
            <input type="password" value={pinVal} onChange={e=>{setPinVal(e.target.value);setPinErr(false);}} onKeyDown={e=>e.key==="Enter"&&submitPin()}
              placeholder="••••"
              style={{ width:"100%",padding:14,border:`2px solid ${pinErr?"#c0392b":"#e8e4df"}`,borderRadius:10,fontSize:24,letterSpacing:".35em",textAlign:"center",fontFamily:"monospace",outline:"none",marginBottom:8 }}/>
            {pinErr && <p style={{ color:"#c0392b",fontSize:12,marginBottom:10 }}>Wrong PIN. Try again.</p>}
            <button onClick={submitPin} style={{ width:"100%",background:"#1a1a1a",color:"#c8a96e",border:"none",borderRadius:10,padding:14,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:15,cursor:"pointer",marginTop:4 }}>
              Unlock ✓
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT DRAWER */}
      {drawerOpen && (
        <ProductDrawer product={editProduct} categories={categories}
          onSave={handleSave} onClose={()=>{setDrawerOpen(false);setEditProduct(null);}}
          uploading={uploading} setUploading={setUploading}/>
      )}

      {/* DELETE CONFIRM */}
      {deletingId && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setDeletingId(null)}>
          <div style={{ background:"#fff",borderRadius:16,padding:"28px 26px",width:"min(320px,90vw)" }} onClick={e=>e.stopPropagation()}>
            <h4 style={{ fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:8 }}>Delete Listing?</h4>
            <p style={{ fontSize:13,color:"#888",marginBottom:20 }}>This will permanently remove the product.</p>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>handleDelete(deletingId)} style={{ flex:1,background:"#c0392b",color:"#fff",border:"none",borderRadius:9,padding:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Yes, Delete</button>
              <button onClick={()=>setDeletingId(null)} style={{ flex:1,background:"#f0ede8",color:"#555",border:"none",borderRadius:9,padding:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGER */}
      {catMgr && <CategoryManager categories={categories} onAdd={handleAddCat} onRemove={handleRemoveCat} onClose={()=>setCatMgr(false)}/>}

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#1a1a1a",color:"#c8a96e",padding:"12px 24px",borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.2)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
