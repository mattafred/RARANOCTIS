const products = [
  {id:'selene',name:'Séléné',category:'Chaîne de corps',price:129,material:'Plaqué or 18 carats',badge:'Nouveau',type:'body',description:'Une ligne de lumière qui relie le cou à la taille. Séléné accompagne le mouvement avec une légèreté presque imperceptible.',dimensions:'Longueur ajustable · 68 à 82 cm'},
  {id:'nyx',name:'Nyx',category:'Chaîne de taille',price:89,material:'Argent 925',badge:'Édition limitée',type:'waist',description:'Deux chaînes fines ponctuées d’un éclat central. Nyx souligne la taille sans jamais la contraindre.',dimensions:'Tour de taille · 68 à 96 cm'},
  {id:'asteria',name:'Astéria',category:'Collier',price:105,material:'Plaqué or 18 carats',badge:'Nouveau',type:'necklace',description:'Un pendentif facetté suspendu à une chaîne délicate, comme une étoile isolée dans le ciel nocturne.',dimensions:'Chaîne · 42 cm + extension 5 cm'},
  {id:'vesper',name:'Vesper',category:'Chaîne de cheville',price:69,material:'Plaqué or 18 carats',badge:'Best-seller',type:'ankle',description:'Une chaîne de cheville à double rang, pensée pour accrocher la lumière à chaque pas.',dimensions:'Longueur · 22 cm + extension 4 cm'},
  {id:'luna',name:'Luna',category:'Bague',price:79,material:'Argent 925',badge:'Nouveau',type:'ring',description:'Deux orbites ouvertes se rencontrent autour du doigt. Une bague sculpturale, douce et parfaitement équilibrée.',dimensions:'Tailles · 50 à 58'},
  {id:'eos',name:'Éos',category:'Jonc',price:95,material:'Plaqué or 18 carats',badge:'Exclusivité web',type:'bracelet',description:'Un jonc fin au profil irrégulier, poli à la main pour une lumière plus organique.',dimensions:'Diamètre intérieur · 58 mm'},
  {id:'atlas',name:'Atlas',category:'Boucles d’oreilles',price:85,material:'Argent 925',badge:'Nouveau',type:'earrings',description:'Deux anneaux asymétriques traversés d’une ligne mobile. Légères, graphiques, silencieuses.',dimensions:'Hauteur · 38 mm'},
  {id:'cassiopee',name:'Cassiopée',category:'Chaîne de poitrine',price:139,material:'Plaqué or 18 carats',badge:'Série numérotée',type:'chest',description:'Une constellation graphique qui se pose sur le décolleté et se prolonge délicatement dans le dos.',dimensions:'Tour de poitrine · 76 à 102 cm'}
];

const money = value => `${new Intl.NumberFormat('fr-TN',{maximumFractionDigits:0}).format(value)} DT`;
const byId = id => products.find(product => product.id === id);

function productArt(product, className='product-art'){
  const silver = product.material.includes('Argent');
  const a = silver ? '#777a7c' : '#8b6c38';
  const b = silver ? '#f1f2f0' : '#f1d69b';
  const c = silver ? '#a9acae' : '#b38c4d';
  const id = `metal-${product.id}`;
  let shape = '';
  if(product.type === 'body') shape = `<path d="M250 50v400M250 125C130 145 88 224 54 318M250 125c120 20 162 99 196 193M250 360c-82-55-145-58-190-41M250 360c82-55 145-58 190-41"/><circle cx="250" cy="125" r="10"/><circle cx="250" cy="360" r="7"/><path d="m241 137 9 17 9-17"/>`;
  if(product.type === 'waist') shape = `<ellipse cx="250" cy="226" rx="190" ry="67" transform="rotate(-7 250 226)"/><ellipse cx="250" cy="252" rx="165" ry="55" transform="rotate(-7 250 252)"/><path d="M268 304v96"/><path d="m258 402 10 19 10-19-10-19z"/>`;
  if(product.type === 'necklace') shape = `<path d="M75 95c18 180 95 281 175 281S407 275 425 95"/><path d="M250 376v56"/><path d="m250 431-25 34 25 27 25-27z"/><circle cx="250" cy="376" r="6"/>`;
  if(product.type === 'ankle') shape = `<ellipse cx="250" cy="235" rx="175" ry="58" transform="rotate(-7 250 235)"/><ellipse cx="250" cy="258" rx="145" ry="47" transform="rotate(-7 250 258)"/><path d="M284 302v74"/><circle cx="284" cy="390" r="12"/><path d="M145 283v49"/>`;
  if(product.type === 'ring') shape = `<ellipse cx="250" cy="260" rx="142" ry="137"/><ellipse cx="250" cy="260" rx="107" ry="103"/><path d="M120 205c58-116 203-116 260 0"/><circle cx="143" cy="172" r="19"/><circle cx="357" cy="172" r="19"/>`;
  if(product.type === 'bracelet') shape = `<path d="M95 238c0-105 70-173 155-173s155 68 155 173-70 175-155 175S95 343 95 238Z"/><path d="M119 238c0-86 59-145 131-145s131 59 131 145-59 147-131 147-131-61-131-147Z"/><path d="M95 238h24M381 238h24"/>`;
  if(product.type === 'earrings') shape = `<path d="M155 75v87c0 105 42 190 95 190s95-85 95-190V75"/><circle cx="155" cy="66" r="16"/><circle cx="345" cy="66" r="16"/><path d="M155 162c-40 56-57 120-38 179M345 162c40 56 57 120 38 179"/><path d="m106 355 11-26 11 26M372 355l11-26 11 26"/>`;
  if(product.type === 'chest') shape = `<path d="M250 55v380M250 148C150 98 70 143 45 245M250 148c100-50 180-5 205 97M45 245c93-18 151 5 205 71M455 245c-93-18-151 5-205 71M250 316c-62 48-97 87-112 130M250 316c62 48 97 87 112 130"/><circle cx="250" cy="148" r="8"/><path d="m239 325 11 20 11-20"/>`;
  return `<svg class="${className}" viewBox="0 0 500 500" role="img" aria-label="Illustration du bijou ${product.name}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><g fill="none" stroke="url(#${id})" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${shape}</g></svg>`;
}
