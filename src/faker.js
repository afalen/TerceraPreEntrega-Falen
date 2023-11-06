import { faker } from "@faker-js/faker";

const { commerce, database, image, string } = faker;

//Generación de productos
const generateProduct = () => {
	return {
		id: database.mongodbObjectId(),
		title: commerce.productName(),
		description: commerce.productDescription(),
		price: commerce.price({ min: 4000, max: 20000, dec: 0, symbol: "$" }),
		code: string.alphanumeric(5),
		thumbnail: image.urlPicsumPhotos(),
		stock: parseInt(string.numeric(2)),
	};
};

//Generación de 100 productos
export const totalProducts = () => {
	const numberOfProducts = 100;
	let products = [];
	for (let i = 0; i < numberOfProducts; i++) {
		const newProduct = generateProduct();
		products.push(newProduct);
	}
	return products;
};