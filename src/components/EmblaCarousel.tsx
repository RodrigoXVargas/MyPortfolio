import React, { useCallback, useEffect, useRef, useState } from "react";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "./EmblaCarouselArrowButtons.tsx";

interface Certificado {
	title: string;
	description: string;
	image: string;
}

type PropType = {
	certificados: Certificado[];
	options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
	const { certificados, options } = props;
	const emblaViewportRef = useRef<HTMLDivElement>(null);
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [
		AutoScroll({ playOnInit: true }),
	]);
	const [isPlaying, setIsPlaying] = useState(false);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);

	const onButtonAutoplayClick = useCallback(
		(callback: () => void) => {
			const autoScroll = emblaApi?.plugins()?.autoScroll;
			if (!autoScroll) return;

			const resetOrStop =
				autoScroll.options.stopOnInteraction === false
					? autoScroll.reset
					: autoScroll.stop;

			resetOrStop();
			callback();
		},
		[emblaApi]
	);

	const toggleAutoplay = useCallback(() => {
		const autoScroll = emblaApi?.plugins()?.autoScroll;
		if (!autoScroll) return;

		const playOrStop = autoScroll.isPlaying()
			? autoScroll.stop
			: autoScroll.play;
		playOrStop();
	}, [emblaApi]);

	const [modalCert, setModalCert] = useState<Certificado | null>(null);

	const showModal = (cert: Certificado) => {
		setModalCert(cert);
	};

	const hideModal = () => {
		const autoScroll = emblaApi?.plugins()?.autoScroll;
		if (autoScroll && !autoScroll.isPlaying()) {
			autoScroll.play();
		}
		setModalCert(null);
	};

	useEffect(() => {
		const autoScroll = emblaApi?.plugins()?.autoScroll;
		const node = emblaViewportRef.current;

		if (!node || !autoScroll) return;

		if (modalCert) {
			autoScroll.stop();
			return;
		}

		setIsPlaying(autoScroll.isPlaying());
		emblaApi
			.on("autoScroll:play", () => setIsPlaying(true))
			.on("autoScroll:stop", () => setIsPlaying(false))
			.on("reInit", () => setIsPlaying(autoScroll.isPlaying()));
	}, [emblaApi, modalCert]);

	return (
		<div>
			<div className="embla">
				<div
					className="embla__viewport"
					ref={(node) => {
						emblaRef(node); // embla-carousel setup
						emblaViewportRef.current = node; // guardamos referencia para eventos
					}}
				>
					<div className="embla__container">
						{certificados.map(({ title, image, description }, index) => (
							<div className="embla__slide" key={index}>
								<div className="embla__slide__number">
									<span className="grid justify-items-stretch ">
										<button
											onClick={() => showModal({ title, description, image })}
										>
											<img
												className="justify-self-center shadow-white/10 mb-4 object-cover rounded shadow w-64 h-32"
												src={image}
												alt={`Certificado ${title}`}
											/>
										</button>

										<div className="justify-self-center w-64 h-32">
											<h3 className="text-lg font-semibold text-yellow-200 mb-2 mr-4 text-wrap">
												{title}
											</h3>
										</div>
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="embla__controls">
					<div className="embla__buttons">
						<PrevButton
							onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
							disabled={prevBtnDisabled}
						/>
						<NextButton
							onClick={() => onButtonAutoplayClick(onNextButtonClick)}
							disabled={nextBtnDisabled}
						/>
					</div>

					<button
						className="embla__play"
						onClick={toggleAutoplay}
						type="button"
					>
						{isPlaying ? "Detener" : "Comenzar"}
					</button>
				</div>
			</div>
			{modalCert && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
					<div className="bg-neutral-800 p-6 rounded-xl shadow-lg max-w-3xl w-full">
						<div className="flex flex-col md:flex-row md:items-center gap-4">
							<img
								src={modalCert.image}
								alt={modalCert.title}
								className="rounded-lg w-full md:w-[300px] h-[200px] object-cover shadow-2xl"
							/>
							<div>
								<h2 className="text-2xl font-semibold text-yellow-300 mb-2">
									{modalCert.title}
								</h2>
								<p className="text-gray-300">{modalCert.description}</p>
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

export default EmblaCarousel;
