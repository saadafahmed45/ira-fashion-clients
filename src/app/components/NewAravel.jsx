import React from 'react'
import productApi from '../api/productApi'

const NewAravel = async () => {
    const productsData = await productApi()
    const newProducts = productsData.slice(-5).reverse();
    console.log(newProducts);

    return (
        <div>NewAravel</div>
    )
}

export default NewAravel