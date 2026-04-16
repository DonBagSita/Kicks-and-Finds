import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Clock, CheckCircle, XCircle, Edit2, Check, X, ShoppingBag, ChevronDown, Search } from "lucide-react";

// ─── PRODUCT DATA ───────────────────────────────────────────────────────────
// Each product has: id, name, brand, price (KES), category, condition, available, postedAt, images[]
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Birkenstock Amsterdam Wool Clogs",
    brand: "Birkenstock",
    price: 4500,
    category: "Clogs",
    condition: "Used – Good",
    available: true,
    postedAt: "2026-04-16T08:00:00",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
    localImages: ["IMG-20260415-WA0002.jpg", "IMG-20260415-WA0004.jpg"],
    whatsapp: "254700000000",
    description: "Dark grey wool felt Birkenstock Amsterdam clogs. Cork footbed with natural leather lining. Loved but still have life in them.",
  },
  {
    id: 2,
    name: "Nike Air Force 1 Triple Black",
    brand: "Nike",
    price: 6500,
    category: "Sneakers",
    condition: "Used – Very Good",
    available: true,
    postedAt: "2026-04-16T07:30:00",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
    localImages: ["IMG-20260415-WA0009.jpg", "IMG-20260415-WA0010.jpg", "IMG-20260415-WA0011.jpg"],
    whatsapp: "254700000000",
    description: "All-black Nike Air Force 1 Low. Clean leather upper with shoe trees included. Minor creasing on toe box.",
  },
  {
    id: 3,
    name: "Nike Court Legacy White Canvas",
    brand: "Nike",
    price: 5800,
    category: "Sneakers",
    condition: "Used – Good",
    available: true,
    postedAt: "2026-04-15T19:00:00",
    images: [],
    localImages: ["IMG-20260415-WA0013.jpg", "IMG-20260415-WA0014.jpg", "IMG-20260415-WA0016.jpg"],
    whatsapp: "254700000000",
    description: "White canvas Nike Court Legacy. Retro low-profile silhouette with gold script logo. Some canvas yellowing — adds character.",
  },
  {
    id: 4,
    name: "Black Patent Penny Loafers",
    brand: "Unbranded",
    price: 3200,
    category: "Loafers",
    condition: "Used – Good",
    available: false,
    postedAt: "2026-04-15T14:00:00",
    images: [],
    localImages: ["IMG-20260415-WA0029.jpg", "IMG-20260415-WA0032.jpg"],
    whatsapp: "254700000000",
    description: "High-shine black patent leather penny loafers. Classic silhouette with moccasin stitching. Size-up if between sizes.",
  },
  {
    id: 5,
    name: "Chunky Horsebit Loafers",
    brand: "Unbranded",
    price: 7500,
    category: "Loafers",
    condition: "Used – Excellent",
    available: true,
    postedAt: "2026-04-15T12:00:00",
    images: [],
    localImages: ["IMG-20260415-WA0034.jpg", "IMG-20260415-WA0036.jpg", "IMG-20260415-WA0037.jpg"],
    whatsapp: "254700000000",
    description: "Black leather chunky lug-sole loafers with gold horsebit hardware. Very lightly worn. Perfect statement shoe.",
  },
  {
    id: 6,
    name: "Adidas Sabalo Red Suede",
    brand: "Adidas",
    price: 5500,
    category: "Sneakers",
    condition: "Used – Good",
    available: true,
    postedAt: "2026-04-15T10:00:00",
    images: [],
    localImages: ["IMG-20260415-WA0038.jpg", "IMG-20260416-WA0001.jpg", "IMG-20260416-WA0002.jpg", "IMG-20260416-WA0003.jpg"],
    whatsapp: "254700000000",
    description: "Burnt red suede Adidas Sabalo with clean white cupsole. White trefoil logo. A rare colourway — seriously a head-turner.",
  },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatPrice(p) {
  return `KES ${p.toLocaleString()}`;
}

// ─── IMAGE COMPONENT ────────────────────────────────────────────────────────
function ProductImage({ localImages, available, name }) {
  const [idx, setIdx] = useState(0);

  // Map local filenames to placeholder colors for demo
  const colors = ["#1a1a1a", "#2d2d2d", "#3a3a3a", "#444"];
  const bgColor = colors[idx % colors.length];

  // Since we can't load local files in the artifact, show styled placeholders
  // In production these would be actual image URLs
  const imageSources = {
    "IMG-20260415-WA0002.jpg": "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80",
    "IMG-20260415-WA0004.jpg": "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80",
    "IMG-20260415-WA0009.jpg": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "IMG-20260415-WA0010.jpg": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "IMG-20260415-WA0011.jpg": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "IMG-20260415-WA0013.jpg": "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    "IMG-20260415-WA0014.jpg": "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    "IMG-20260415-WA0016.jpg": "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80",
    "IMG-20260415-WA0029.jpg": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    "IMG-20260415-WA0032.jpg": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    "IMG-20260415-WA0034.jpg": "https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52?w=600&q=80",
    "IMG-20260415-WA0036.jpg": "https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52?w=600&q=80",
    "IMG-20260415-WA0037.jpg": "https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52?w=600&q=80",
    "IMG-20260415-WA0038.jpg": "https://images.unsplash.com/photo-1578116922645-3976907a7671?w=600&q=80",
    "IMG-20260416-WA0001.jpg": "https://images.unsplash.com/photo-1578116922645-3976907a7671?w=600&q=80",
    "IMG-20260416-WA0002.jpg": "https://images.unsplash.com/photo-1578116922645-3976907a7671?w=600&q=80",
    "IMG-20260416-WA0003.jpg": "https://images.unsplash.com/photo-1578116922645-3976907a7671?w=600&q=80",
  };

  const src = imageSources[localImages[idx]] || "";

  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "125%", background: "#f0ede8", overflow: "hidden" }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            filter: available ? "none" : "grayscale(100%) brightness(0.7)",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#666", fontSize: 14, fontFamily: "serif" }}>No image</span>
        </div>
      )}

      {/* Sold overlay */}
      {!available && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
        }}>
          <span style={{
            background: "#c0392b", color: "#fff", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 13, letterSpacing: "0.15em",
            padding: "6px 18px", textTransform: "uppercase",
          }}>SOLD</span>
        </div>
      )}

      {/* Image dots */}
      {localImages.length > 1 && (
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
          {localImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === idx ? "#fff" : "rgba(255,255,255,0.5)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}

      {/* Prev/Next tap zones */}
      {localImages.length > 1 && (
        <>
          <button onClick={() => setIdx(i => (i - 1 + localImages.length) % localImages.length)}
            style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "30%", background: "none", border: "none", cursor: "pointer" }} />
          <button onClick={() => setIdx(i => (i + 1) % localImages.length)}
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", background: "none", border: "none", cursor: "pointer" }} />
        </>
      )}
    </div>
  );
}

// ─── PRICE EDITOR ───────────────────────────────────────────────────────────
function PriceEditor({ price, onSave, adminMode }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(price);
  const inputRef = useRef(null);

  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  if (!adminMode) return (
    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
      {formatPrice(price)}
    </span>
  );

  return editing ? (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontFamily: "monospace", fontSize: 14, color: "#888" }}>KES</span>
      <input
        ref={inputRef}
        type="number"
        value={val}
        onChange={e => setVal(Number(e.target.value))}
        style={{
          width: 90, padding: "4px 8px", border: "2px solid #c8a96e",
          borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700,
        }}
      />
      <button onClick={() => { onSave(val); setEditing(false); }}
        style={{ background: "#2d6a4f", color: "#fff", border: "none", borderRadius: 5, padding: "4px 8px", cursor: "pointer" }}>
        <Check size={14} />
      </button>
      <button onClick={() => { setVal(price); setEditing(false); }}
        style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: 5, padding: "4px 8px", cursor: "pointer" }}>
        <X size={14} />
      </button>
    </div>
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
        {formatPrice(price)}
      </span>
      <button onClick={() => setEditing(true)}
        style={{ background: "none", border: "1px dashed #c8a96e", borderRadius: 5, padding: "3px 7px", cursor: "pointer", color: "#c8a96e" }}>
        <Edit2 size={12} />
      </button>
    </div>
  );
}

// ─── PRODUCT CARD ───────────────────────────────────────────────────────────
function ProductCard({ product, onUpdatePrice, adminMode }) {
  const [liked, setLiked] = useState(false);

  const waMsg = encodeURIComponent(
    `Hi! I'm interested in the *${product.name}* listed at *${formatPrice(product.price)}*. Is it still available? 👟`
  );
  const waLink = `https://wa.me/${product.whatsapp}?text=${waMsg}`;

  const lipaMsg = encodeURIComponent(
    `Hi! I'd like to book the *${product.name}* (${formatPrice(product.price)}) on Lipa Pole Pole. What's the deposit amount? 🙏`
  );
  const lipaLink = `https://wa.me/${product.whatsapp}?text=${lipaMsg}`;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.2s, transform 0.2s",
      position: "relative",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.14)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative" }}>
        <ProductImage localImages={product.localImages} available={product.available} name={product.name} />

        {/* Like button */}
        <button
          onClick={() => setLiked(l => !l)}
          style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
            border: "none", borderRadius: "50%", width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Heart size={16} fill={liked ? "#e74c3c" : "none"} color={liked ? "#e74c3c" : "#555"} />
        </button>

        {/* Condition badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
          borderRadius: 20, padding: "3px 10px",
          fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          color: "#333", letterSpacing: "0.04em",
        }}>
          {product.condition}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Brand + time */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#c8a96e", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            {product.brand}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#aaa", fontFamily: "'DM Sans', sans-serif" }}>
            <Clock size={11} /> {timeAgo(product.postedAt)}
          </span>
        </div>

        {/* Name */}
        <h3 style={{ margin: 0, fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35 }}>
          {product.name}
        </h3>

        {/* Description */}
        <p style={{ margin: 0, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", color: "#777", lineHeight: 1.6 }}>
          {product.description}
        </p>

        {/* Availability */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {product.available
            ? <><CheckCircle size={13} color="#2d6a4f" /><span style={{ fontSize: 12, color: "#2d6a4f", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Available</span></>
            : <><XCircle size={13} color="#c0392b" /><span style={{ fontSize: 12, color: "#c0392b", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Sold</span></>
          }
        </div>

        {/* Price */}
        <div style={{ marginTop: 4 }}>
          <PriceEditor price={product.price} onSave={(p) => onUpdatePrice(product.id, p)} adminMode={adminMode} />
        </div>

        {/* Buttons */}
        {product.available && (
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                background: "#25D366", color: "#fff",
                borderRadius: 10, padding: "11px 0",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
                textDecoration: "none", transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.87"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <MessageCircle size={15} /> Enquire
            </a>
            <a href={lipaLink} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: "#1a1a1a", color: "#c8a96e",
                borderRadius: 10, padding: "11px 0",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12,
                textDecoration: "none", border: "1.5px solid #2d2d2d", transition: "background 0.15s",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2d2d2d"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; }}
            >
              💳 Lipa Pole Pole
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function KicksAndFinds() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [adminMode, setAdminMode] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState(false);

  const PIN = "1234"; // change this

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  // Sort newest first
  const sorted = [...products].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

  const filtered = sorted.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filter === "All" || p.category === filter;
    return matchesSearch && matchesCat;
  });

  function handleUpdatePrice(id, newPrice) {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, price: newPrice } : p));
  }

  function handleAdminToggle() {
    if (adminMode) { setAdminMode(false); return; }
    setShowPinModal(true);
  }

  function handlePinSubmit() {
    if (adminPin === PIN) {
      setAdminMode(true);
      setShowPinModal(false);
      setAdminPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4f0", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0ede8; }
        ::-webkit-scrollbar-thumb { background: #c8a96e; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to {opacity:1;transform:translateY(0);} }
        .card-animate { animation: fadeUp 0.45s ease both; }
      `}</style>

      {/* HEADER */}
      <header style={{
        background: "#1a1a1a", color: "#fff", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={22} color="#c8a96e" />
            <div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Kicks <span style={{ color: "#c8a96e" }}>&</span> Finds
              </span>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: -2 }}>
                Pre-loved · Mombasa
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{filtered.length} items</span>
            <button
              onClick={handleAdminToggle}
              style={{
                background: adminMode ? "#c8a96e" : "transparent",
                color: adminMode ? "#1a1a1a" : "#888",
                border: "1px solid", borderColor: adminMode ? "#c8a96e" : "#444",
                borderRadius: 8, padding: "6px 14px", cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
            >
              {adminMode ? "✏️ Editing" : "Admin"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO STRIP */}
      <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2420 100%)", padding: "28px 20px", textAlign: "center" }}>
        <p style={{ margin: 0, color: "#c8a96e", fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          ✦ Fresh drops · Lipa Pole Pole available · DM to cop ✦
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 0" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search shoes…"
              style={{
                width: "100%", padding: "12px 14px 12px 38px",
                border: "1.5px solid #e8e4df", borderRadius: 12,
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                background: "#fff", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#c8a96e"}
              onBlur={e => e.target.style.borderColor = "#e8e4df"}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{
                  padding: "9px 18px", borderRadius: 20,
                  border: filter === cat ? "2px solid #c8a96e" : "1.5px solid #e0dbd4",
                  background: filter === cat ? "#c8a96e" : "#fff",
                  color: filter === cat ? "#1a1a1a" : "#666",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                  cursor: "pointer", transition: "all 0.18s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {adminMode && (
          <div style={{ marginTop: 14, background: "#fff8ec", border: "1.5px dashed #c8a96e", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#9a6f28", fontWeight: 600 }}>
            ✏️ Admin mode — click the price pencil icon on any listing to edit the price.
          </div>
        )}
      </div>

      {/* GRID */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa", fontFamily: "'Playfair Display', serif", fontSize: 22 }}>
            No items found 👟
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {filtered.map((product, i) => (
              <div key={product.id} className="card-animate" style={{ animationDelay: `${i * 0.06}s` }}>
                <ProductCard product={product} onUpdatePrice={handleUpdatePrice} adminMode={adminMode} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ background: "#1a1a1a", padding: "32px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#c8a96e", marginBottom: 6 }}>
          Kicks <span style={{ color: "#fff" }}>&</span> Finds
        </div>
        <p style={{ color: "#666", fontSize: 12, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          Pre-loved footwear · Mombasa, Kenya · DM to cop 👟
        </p>
      </footer>

      {/* ADMIN PIN MODAL */}
      {showPinModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
          onClick={() => { setShowPinModal(false); setAdminPin(""); setPinError(false); }}
        >
          <div style={{
            background: "#fff", borderRadius: 18, padding: "36px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)", minWidth: 300,
          }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#1a1a1a", margin: "0 0 6px" }}>Admin Access</h3>
            <p style={{ color: "#888", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 20px" }}>Enter PIN to edit prices</p>
            <input
              type="password"
              value={adminPin}
              onChange={e => { setAdminPin(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === "Enter" && handlePinSubmit()}
              placeholder="••••"
              style={{
                width: "100%", padding: "12px 16px", border: `2px solid ${pinError ? "#e74c3c" : "#e0dbd4"}`,
                borderRadius: 10, fontSize: 20, letterSpacing: "0.3em", textAlign: "center",
                fontFamily: "monospace", outline: "none", marginBottom: 8,
              }}
            />
            {pinError && <p style={{ color: "#e74c3c", fontSize: 12, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>Wrong PIN. Try again.</p>}
            <button onClick={handlePinSubmit}
              style={{
                width: "100%", background: "#1a1a1a", color: "#c8a96e",
                border: "none", borderRadius: 10, padding: "13px",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
                marginTop: 4,
              }}
            >
              Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
