const jsonUrl = 'https://fakestoreapi.com/products';
let allproducts = [];

async function loadprodut(){
  try{
    const response=await fetch(jsonUrl);
    const products=await response.json();
    allproducts=products;
    displayProducts(products);
  }catch(error){
    console.error('Error loading products:',error);
  }
}
loadprodut();
let cartcount = parseInt(localStorage.getItem('cartcount')) || 0;

function uploadcartbadge() {
  const badge = document.getElementById('Cart-count');
  if (!badge) return;

  if (cartcount > 0) {
    badge.textContent = cartcount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
  
  localStorage.setItem('cartcount', cartcount);
}
localStorage.setItem('cartcount', '0');
localStorage.setItem('cart', JSON.stringify([]));
 cartcount = 0;
uploadcartbadge();

function addToCart(product) {
  cartcount++;
  uploadcartbadge();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
}

function displayProducts(products) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = ''; 
  products.forEach(product => {
    const starsCount = Math.round(product.rating.rate);
    const stars = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
    const card = document.createElement('div');
    card.className = "bg-stone-100 shadow-md rounded-lg p-4 flex flex-col justify-between w-[325px] h-[444px] hover:scale-105";
    card.innerHTML = `
      <img src="${product.image}" class="h-48 w-full object-contain mb-4">
      <div>
        <h2 class="text-md font-semibold mb-2 font-serif">${product.title}</h2>
        <p class="text-gray-700 mb-2 font-serif">price: ${product.price} LYD</p>
        <div class="flex items-center text-yellow-500 mb-2">
          <span class="mr-2">${stars}</span>
          <span class="text-gray-500 text-sm font-serif">(${product.rating.count})</span>
        </div>
      </div>
      <button class="mt-2 self-start text-white py-2 px-4 rounded-2xl transition text-md details-btn" style="background-color:#4F767F;">Details</button>
    `;
    grid.appendChild(card);
  });
  document.querySelectorAll('.details-btn').forEach((btn,index)=>{
    btn.addEventListener('click',()=>{
    const product=products[index];
    document.getElementById('modal-title').textContent=product.title;
    document.getElementById('modal-image').src=product.image;
    document.getElementById('modal-description').textContent=product.description;
    document.getElementById('modal-price').textContent=`${product.price} LYD`;
    const model=document.getElementById('product-modal');
    model.classList.remove('hidden');
     document.getElementById('add-to-cart').onclick = () => {
    addToCart(product);
  };
    model.querySelector('[data-modal-hide]').addEventListener('click',()=>{
      model.classList.add('hidden');
     const closerBtn=model.querySelector(['data-modal-hide']);
     closerBtn.addEventListener('click',()=>{
      model.classList.add('hidden');
     });
    });
    });

    });
}
async function loadcategory() {
  try{
    const response=await fetch('https://fakestoreapi.com/products/categories');
    const categoryies=await response.json();
    createCategoryButtons(categoryies);
  }catch(error){
    console.error('Error loading products:',error);
  }
}
loadcategory();
function createCategoryButtons(categoryies){
  const container=document.getElementById('category-buttons');
  container.innerHTML='';
  categoryies.forEach(category=>{
    const button =document.createElement('button');
   button.className="relative inline-flex p-0.5 rounded-full bg-gradient-to-br from-[#F1E4A6] to-[#8D8662] group focus:ring-4 focus:outline-none focus:ring-[#F1E4A6]/40 dark:focus:ring-[#8D8662]/40";
   button.innerHTML=`<span class="flex items-center justify-center px-6 py-3 text-sm font-medium text-heading bg-white rounded-full group-hover:bg-[#F1E4A6] transition-colors">${category}</span>`
  button.addEventListener('click',()=>{
    categorys(category);
  } );
  container.appendChild(button);
  });
}
function categorys(category) {
  const filtered = allproducts.filter(product => product.category === category);
  displayProducts(filtered);
}

function debounce(fn, delay) {
  let timeoutID;
  return function(...args) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const searchinput = document.getElementById('search');
searchinput.addEventListener('input', debounce(() => {
  const query = searchinput.value.toLowerCase();
  const filtered = allproducts.filter(p => p.title.toLowerCase().includes(query));
  displayProducts(filtered);
},1000));
