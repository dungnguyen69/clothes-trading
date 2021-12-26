import React, {useContext, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'

const initialState = {
    size:'',
}
function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])
    useEffect(() =>{
        if(params.id){

            products.forEach(product => {
                if(product._id === params.id) setDetailProduct(product)
            })
        }
    },[params.id, products])
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setDetailProduct({...detailProduct, [name]:value})
    }
    const addToCart = (detailProduct) =>{
        console.log(detailProduct);
        addCart(detailProduct)
    }
    if(detailProduct.length === 0) return null;

    return (
        <>
            <div className="detail">
                <img src={detailProduct.images.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailProduct.title}</h2>
                        <p className="id-style">#ID: {detailProduct.product_id}</p>
                    </div>
                    <h3 className='price'>$ {detailProduct.price}</h3>
                    <p>{detailProduct.description}</p>
                    <p className="after-view">{detailProduct.content}</p>
                    
                    <label htmlFor="size">Size: </label>
                    <select name="size" value={detailProduct.size} onChange={handleChangeInput}>
                        <option value="">Please select size</option>
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                    </select>

                    <p className="after-view">Sold: <span className="sold">{detailProduct.sold}</span></p>
                    
                    <Link to="#!" className="cart" onClick={() =>  addToCart(detailProduct)}>
                        Buy Now
                    </Link>
                </div>
            </div>

            <div>
                <h2>Related products</h2>
                <div className="products">
                    {
                        products.map(product => {
                            return product.category === detailProduct.category 
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailProduct