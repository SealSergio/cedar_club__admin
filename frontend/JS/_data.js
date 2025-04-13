const url = 'http://localhost:3000/api/products';

export async function getProductsDataArray() {
    return await fetch(url).then(res => res.json());
}

export async function getProductData(id) {
    const response = await fetch(`${url}/${id}`);
    const productData = await response.json();
    return {productData, response};
}

export async function addProductData(productObj) {
    return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(productObj),
    headers: {
        'Content-Type': 'application/json',
    }
    });
}

export async function changeProductData(productObj, id) {
    return await fetch(`${url}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(productObj),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function deleteProductData(id) {
    return await fetch(`${url}/${id}`, {
        method: 'DELETE',
    });
}
