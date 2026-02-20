function Footer() {
	return (
		<footer
			className="footer mt-1 flex items-center justify-center"
			role="contentinfo"
		>
			<a
				className="footer__home mt-[0.2em] mr-[0.45em] flex h-[45px] w-[110px] items-center rounded-[10px] border border-black/0 px-2.5 py-0.5 decoration-0 dark:border-white/0"
				href="https://iamgrid.co.uk"
			>
				<svg
					version="1.1"
					className="footer__home_svg mt-0.5 w-[82px] shrink-0 grow-0 fill-black opacity-40 dark:fill-white"
					id="iamgrid_logo"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 600 250"
					xmlSpace="preserve"
				>
					<g>
						<rect x="23" y="23" width="42.22" height="39.973" />
						<path
							d="M402.734,113.685h-43.717v46.721h-42.22V85.669c0-3.483,1.206-6.431,3.619-8.84
			c2.412-2.409,5.374-3.615,8.87-3.615h73.447V113.685z"
						/>
						<path d="M454.699,62.973h-42.22V23h42.22V62.973z M454.699,160.405h-42.22V73.213h42.22V160.405z" />
						<path
							d="M539.132,23v50.213h-62.699c-3.504,0-6.458,1.206-8.871,3.615c-2.419,2.409-3.625,5.357-3.625,8.84v62.281
			c0,3.32,1.206,6.228,3.625,8.715c2.413,2.493,5.367,3.74,8.871,3.74h88.682c3.334,0,6.248-1.206,8.749-3.625
			c2.494-2.413,3.748-5.367,3.748-8.871V23H539.132z M539.132,119.181h-32.976v-15.736h32.976V119.181z"
						/>
						<rect x="164.942" y="90.094" width="9.066" height="70.311" />
						<rect x="137.749" y="90.094" width="9.064" height="70.311" />
						<g>
							<rect x="83.353" y="90.094" width="9.064" height="13.351" />
							<rect x="83.353" y="119.181" width="9.064" height="41.225" />
						</g>
						<path
							d="M119.617,73.213h-9.067v35.999v51.193h9.067v-51.193V85.669c0-3.483,1.207-6.431,3.619-8.84
			s5.374-3.615,8.871-3.615H119.617z"
						/>
						<path
							d="M65.22,73.213h-9.067H23v87.192h42.22v-51.193V85.669c0-3.483,1.206-6.431,3.619-8.84
			s5.374-3.615,8.871-3.615H65.22z"
						/>
						<path
							d="M302.059,76.846c-2.494-2.419-5.414-3.632-8.741-3.632h-77.676h-11.012c-3.497,0-6.458,1.206-8.871,3.615
			s-3.619,5.357-3.619,8.84v23.543v51.193h12.49h11.012h51.694v25.481h-72.448v40.471h98.43c3.327,0,6.247-1.254,8.741-3.754
			c2.5-2.508,3.747-5.422,3.747-8.756V85.723C305.806,82.223,304.559,79.265,302.059,76.846z M267.335,130.174h-32.976v-16.489
			h32.976V130.174z"
						/>
					</g>
				</svg>
				<div className="footer__home-text hidden w-0 grow truncate text-left text-[0.7em] text-black/0 uppercase md:block dark:text-white/0">
					&gt; Home
				</div>
			</a>
			<div className="footer__text py-[0.6em] pr-3 text-xs leading-[1.7em] text-black/25 dark:text-white/25">
				<span className="footer__text-separator footer__text-separator--hide-on-small-screens px-[1em] text-black/10 dark:text-white/10">
					{" "}
					|{" "}
				</span>
				This app is fully responsive. Try it on your phone! :)
				<span className="footer__text-separator px-[1em] text-black/10 dark:text-white/10">
					{" "}
					|{" "}
				</span>
				<a
					href="https://github.com/iamgrid/react-19_2-playground"
					target="_blank"
					rel="noreferrer"
					className="footer__text-link text-nowrap text-black/50 hover:text-black/75 dark:text-white/50 dark:hover:text-white/75"
				>
					GitHub Repo
				</a>
			</div>
		</footer>
	);
}

export default Footer;
