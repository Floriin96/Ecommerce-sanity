import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline} from 'react-icons/ti';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useStateContext } from '../context/StateContext'; 
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';




const Cart = () => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove,sizes} = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();
    
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });

    if(response.statusCode === 500) return;

    const data = await response.json();

    toast.loading('Redirecting...');

    stripe.redirectToCheckout({ sessionId: data.id });
  }
  const router = useRouter();
  
  return (
    <div className="cart'wrapper" ref={cartRef}>
      <div className="cart-container">
         <button
           type="button"
           className="cart-heading"
           onClick={() => setShowCart(false) }>
             <AiOutlineLeft></AiOutlineLeft>
             <span className="heading">COSUL TAU</span>
             <span className="cart-num-items">({totalQuantities} items)</span>
         </button>

         {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150}></AiOutlineShopping>
            <h3>Cosul tau este gol</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
                >
                  Continua cumparaturile
              </button>
            </Link>
          </div>
         )}

         <div className="product-container">
            {cartItems.length >= 1 && cartItems.map((item) => (
              <div className="product" key= { item.id }>
                <img layout="intrinsic" src={urlFor(item?.image[0])} className="cart-product-image"></img>
                <div className="item-desc">
                  <div className="flex-top">
                    <h5>{item.name}</h5>
                    <h4>{item.price}Lei</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                    <p className="quantity-desc" >
                  <span className="minus" onClick={() => toggleCartItemQuanitity(item._id, 'dec') }>
                    <AiOutlineMinus></AiOutlineMinus>
                    </span>
                  <span className="num" onClick="">{item.quantity}</span>
                  <span className="plus" onClick={() => toggleCartItemQuanitity(item._id, 'inc') }><AiOutlinePlus></AiOutlinePlus></span>
                    </p> 
                    </div>
                    <label>
                      <h6>Marime</h6>
                        <h6>{item.size}</h6>
                        <h3>{item.size}</h3>
                    </label>
                    <button
                    type="button"
                    className="remove-item"
                    onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline></TiDeleteOutline>
                    </button>
                  </div>
                </div>
              </div>
            ))} 
         </div>
         {cartItems.length >= 1 &&(
          <div className="cart-bottom">
            <div className="total">
              <h3>Total:</h3>
              <h3>{totalPrice}Lei</h3>
            </div>
            <button type="button" className="btn" onClick={() => router.replace('/Ramburs')}>
      Metode de plata
    </button>
          </div>
         )}
      </div>
    </div>
  )
}
export default Cart 