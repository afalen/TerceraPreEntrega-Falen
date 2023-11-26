/* const newCart = async () => {
	try {
		if (!cartId) {
			const resp = await fetch(`http://localhost:8080/api/carts/`, {
				method: "POST",
			});
			const result = await resp.json();
			console.log("resultado", result);
			cartId = result.data._id;

			cartDiv.innerHTML = cartId;

			const cartLink = document.getElementById("cartLink");
			cartLink.href = `http://localhost:8080/carts/${cartId}`;
		} else {
			console.log("Se esta usando un carrito");
		}
	} catch (error) {
		console.log("Error: ", error.message);
	}
}; */

const addToCart = async (productId) =>{
    try{
        const result = await fetch('http://localhost:8080/api/sessions/current', {
            method: "GET",
        }) 
        const user = await result.json()

        const cartId = user?.payload.cart

        if(cartId){
            const resp = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
                method: "POST",
            })
            const ress = await resp.json()
			if(ress.result == 'success'){
				Swal.fire('Agregado al carrito!')
			}else{
				Swal.fire(ress.message)
			}
		}

    } catch(error){
        console.log(error)
    }
}
