import { transporter } from '../config/email.config.js';
import { config } from '../config/config.js';


export const sendEmailController = async (email, result) => {
	try {
		//console.log(result)
		const emailTemplate = `<div>
				<h1>Gracias por tu compra!!</h1>
				<h2>Detalles de tu compra:</h2>
				<p> Código de compra: ${result.ticket.code}</p>
				<p> Hora de compra: ${result.ticket.purchase_datetime}</p>
				<div>
					<h3>Productos:</h3>
					<ul>
						${result.cart.map(product => `<li>${product.nombre} x ${product.quantity} -  ${product.precio}</li>`).join('')}
					</ul>
				</div>
				<p> Monto Total de compra: ${result.total} </p>
		</div>`;
		const mailOptions = {
			from: `Ecommerce Proyect ${config.adminEmail}`,
			to: email,
			subject: "Compra exitosa",
			html: emailTemplate,
		};
		await transporter.sendMail(mailOptions);

	} catch (error) {
		console.log(error.message);
	}
};