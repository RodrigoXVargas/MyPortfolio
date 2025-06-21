import React, { useState } from "react";

interface Certificado {
	title: string;
	description: string;
	image: string;
}

type PropType = {
	cert: Certificado;
	open: boolean;
};

const ModalCert: React.FC<PropType> = (props) => {
	const { title, description, image } = props.cert;
	const [isOpen, setIsOpen] = useState(props.open);

	const hideModal = () => setIsOpen(false);

	return (
		<div>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
					<div className="bg-neutral-800 p-6 rounded-xl shadow-lg max-w-3xl w-full">
						<div className="flex flex-col md:flex-row gap-4">
							<img
								src={image}
								alt={title}
								className="rounded-lg max-w-full md:max-w-[300px] shadow-2xl"
							/>
							<div>
								<h2 className="text-2xl font-semibold text-yellow-300 mb-2">
									{title}
								</h2>
								<p className="text-gray-300">{description}</p>
							</div>
						</div>
						<button
							onClick={hideModal}
							className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
						>
							Cerrar
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ModalCert;
