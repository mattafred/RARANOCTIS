const safeParse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
let cart=safeParse('rara-cart',[]);
let wishlist=safeParse('rara-wishlist',[]);
let productPage=0;

function productCard(product){
  const liked=wishlist.includes(product.id);
  return `<article class="product-card reveal visible"><div class="product-image" data-view-product="${product.id}"><span class="product-badge">${product.badge}</span><button class="heart ${liked?'active':''}" data-wishlist="${product.id}" aria-label="${liked?'Retirer':'Ajouter'} ${product.name} des favoris"><svg viewBox="0 0 24 24"><path d="M20.3 5.7a5 5 0 0 0-7.1 0L12 6.9l-1.2-1.2a5 5 0 0 0-7.1 7.1L12 21l8.3-8.2a5 5 0 0 0 0-7.1Z"/></svg></button>${productArt(product)}<button class="quick-add" data-add="${product.id}">Ajouter au panier</button></div><div class="product-info"><h3>${product.name}</h3><p>${product.category} · ${product.material}</p><span>${money(product.price)}</span></div></article>`;
}

function renderProducts(){
  const start=productPage*4;
  document.querySelector('#productGrid').innerHTML=products.slice(start,start+4).map(productCard).join('');
}

function persist(){
  localStorage.setItem('rara-cart',JSON.stringify(cart));
  localStorage.setItem('rara-wishlist',JSON.stringify(wishlist));
  updateCounts();
}

function updateCounts(){
  const count=cart.reduce((total,item)=>total+item.qty,0);
  document.querySelector('#cartCount').textContent=count;
  document.querySelector('#drawerCartCount').textContent=`(${count})`;
  document.querySelector('#wishlistCount').textContent=wishlist.length;
}

function addToCart(id,open=false){
  const existing=cart.find(item=>item.id===id);
  existing?existing.qty++:cart.push({id,qty:1});
  persist();renderCart();showToast(`${byId(id).name} a rejoint votre sélection`);
  if(open)openPanel('cartDrawer');
}

function toggleWishlist(id){
  wishlist=wishlist.includes(id)?wishlist.filter(item=>item!==id):[...wishlist,id];
  persist();renderProducts();renderWishlist();
  showToast(wishlist.includes(id)?'Ajouté à vos favoris':'Retiré de vos favoris');
}

function renderCart(){
  const body=document.querySelector('#cartItems');
  const footer=document.querySelector('#cartFooter');
  if(!cart.length){body.innerHTML=`<div class="empty-state"><span>◇</span><h3>Votre nuit commence ici.</h3><p>Votre panier est encore vide.</p></div>`;footer.innerHTML='';return}
  body.innerHTML=cart.map(item=>{const p=byId(item.id);return `<div class="cart-item"><div class="mini-art">${productArt(p,'')}</div><div><h3>${p.name}</h3><p>${p.category}<br>${p.material}</p><div class="item-controls"><button data-qty="${p.id}" data-delta="-1">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><div><button class="item-remove" data-remove="${p.id}" aria-label="Retirer">×</button><p>${money(p.price*item.qty)}</p></div></div>`}).join('');
  const total=cart.reduce((sum,item)=>sum+byId(item.id).price*item.qty,0);
  footer.innerHTML=`<div class="subtotal"><span>Sous-total</span><strong>${money(total)}</strong></div><button class="button" data-checkout>Commander sur WhatsApp <span>↗</span></button><p class="shipping-note">Livraison en Tunisie · Commande au +216 52 653 088</p>`;
}

function renderWishlist(){
  const body=document.querySelector('#wishlistItems');
  if(!wishlist.length){body.innerHTML=`<div class="empty-state"><span>✦</span><h3>Vos étoiles choisies.</h3><p>Enregistrez ici les pièces qui vous attirent.</p></div>`;return}
  body.innerHTML=wishlist.map(id=>{const p=byId(id);return `<div class="wish-item"><div class="mini-art">${productArt(p,'')}</div><div><h3>${p.name}</h3><p>${p.category}<br>${money(p.price)}</p><button class="wish-add" data-add="${p.id}">Ajouter au panier</button></div><button class="item-remove" data-wishlist="${p.id}" aria-label="Retirer">×</button></div>`}).join('');
}

function openProduct(id){
  const p=byId(id);
  document.querySelector('#modalVisual').innerHTML=productArt(p,'');
  document.querySelector('#modalCopy').innerHTML=`<p class="eyebrow dark">${p.category}</p><h2>${p.name}</h2><p class="modal-price">${money(p.price)}</p><p class="modal-description">${p.description}</p><div class="material-choice"><button class="active">${p.material}</button></div><button class="button" data-add="${p.id}">Ajouter au panier <span>↗</span></button><div class="details-list"><div><span>Dimensions</span><span>${p.dimensions}</span></div><div><span>Matière</span><span>${p.material} · Hypoallergénique</span></div><div><span>Entretien</span><span>Éviter l’eau et les parfums · Pochette fournie</span></div><div><span>Livraison</span><span>Expédition sous 2 à 4 jours ouvrés</span></div></div>`;
  openPanel('productModal');
}

function openPanel(id){
  closePanels(false);
  const panel=document.getElementById(id);
  panel.classList.add('open');panel.setAttribute('aria-hidden','false');
  document.querySelector('#overlay').classList.add('open');document.body.classList.add('no-scroll');
  if(id==='searchPanel')setTimeout(()=>document.querySelector('#searchInput').focus(),300);
}

function closePanels(unlock=true){
  document.querySelectorAll('.drawer,.search-panel,.product-modal').forEach(panel=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});
  if(unlock){document.querySelector('#overlay').classList.remove('open');document.body.classList.remove('no-scroll')}
}

let toastTimer;
function showToast(message){
  const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300);
}

document.addEventListener('click',event=>{
  const target=event.target;
  const wish=target.closest('[data-wishlist]');if(wish){event.stopPropagation();toggleWishlist(wish.dataset.wishlist);return}
  const add=target.closest('[data-add]');if(add){event.stopPropagation();addToCart(add.dataset.add);return}
  const view=target.closest('[data-view-product]');if(view){openProduct(view.dataset.viewProduct);return}
  if(target.closest('[data-open-cart]')){renderCart();openPanel('cartDrawer')}
  if(target.closest('[data-open-wishlist]')){renderWishlist();openPanel('wishlistDrawer')}
  if(target.closest('[data-open-search]')){document.querySelector('#mobileMenu').classList.remove('open');openPanel('searchPanel')}
  if(target.closest('[data-close-drawers]')||target.id==='overlay')closePanels();
  const qty=target.closest('[data-qty]');if(qty){const item=cart.find(i=>i.id===qty.dataset.qty);item.qty+=Number(qty.dataset.delta);if(item.qty<1)cart=cart.filter(i=>i.id!==item.id);persist();renderCart()}
  const remove=target.closest('[data-remove]');if(remove){cart=cart.filter(i=>i.id!==remove.dataset.remove);persist();renderCart()}
  if(target.closest('[data-checkout]')){
    const lines=cart.map(item=>{const p=byId(item.id);return `• ${p.name} × ${item.qty} — ${money(p.price*item.qty)}`});
    const total=cart.reduce((sum,item)=>sum+byId(item.id).price*item.qty,0);
    const message=['Bonjour Rara Noctis, je souhaite commander :','',...lines,'',`Total : ${money(total)}`].join('\n');
    window.open(`https://wa.me/21652653088?text=${encodeURIComponent(message)}`,'_blank','noopener');
  }
});

document.querySelector('#productsPrev').addEventListener('click',()=>{productPage=productPage===0?1:0;renderProducts()});
document.querySelector('#productsNext').addEventListener('click',()=>{productPage=productPage===1?0:1;renderProducts()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closePanels();document.querySelector('#mobileMenu').classList.remove('open')}});

const menu=document.querySelector('#mobileMenu');
document.querySelector('#mobileMenuButton').addEventListener('click',()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll')});
document.querySelector('#menuClose').addEventListener('click',()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');document.body.classList.remove('no-scroll')}));

const searchInput=document.querySelector('#searchInput');
function search(query=''){
  const normalized=query.trim().toLocaleLowerCase('fr');
  const matches=normalized?products.filter(p=>`${p.name} ${p.category} ${p.material}`.toLocaleLowerCase('fr').includes(normalized)):products.slice(0,4);
  document.querySelector('#searchResults').innerHTML=matches.length?matches.map(p=>`<div class="search-result" data-view-product="${p.id}"><div class="mini-art">${productArt(p,'')}</div><div><h3>${p.name}</h3><p>${p.category} · ${money(p.price)}</p></div></div>`).join(''):`<p>Aucune pièce ne correspond à cette recherche.</p>`;
}
searchInput.addEventListener('input',event=>search(event.target.value));
document.querySelector('#newsletterForm').addEventListener('submit',event=>{event.preventDefault();showToast('Bienvenue dans le cercle nocturne.');event.target.reset()});

const header=document.querySelector('#siteHeader');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>80),{passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));

renderProducts();renderCart();renderWishlist();updateCounts();search();
