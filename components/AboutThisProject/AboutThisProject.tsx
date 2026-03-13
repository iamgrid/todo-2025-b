import { useState, useRef } from "react";

function AboutThisProject() {
	const [isATPActive, setIsATPActive] = useState<boolean>(false);
	const [isATPTransitioning, setIsATPTansitioning] = useState<boolean>(false);
	const mainRef = useRef<HTMLElement>(null);

	function handleHeaderClick() {
		if (isATPTransitioning) {
			return;
		}

		setIsATPTansitioning(true);
		if (isATPActive) {
			if (mainRef.current) {
				mainRef.current.style.opacity = "0";
			}
			setTimeout(() => {
				setIsATPActive(false);
				setIsATPTansitioning(false);
			}, 300);
		} else {
			setIsATPActive(true);
			setTimeout(() => {
				if (mainRef.current) {
					mainRef.current.style.opacity = "1";
				}
				setIsATPTansitioning(false);
			}, 50);
		}
	}

	return (
		<div className={`atp ${isATPActive ? "atp--active" : ""}`}>
			<button type="button" className="atp__header" onClick={handleHeaderClick}>
				<div className="atp__cog">
					<svg
						className="svg-cog-icon"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						width="26px"
						height="26px"
						viewBox="0 0 26 26"
						xmlSpace="preserve"
					>
						<path
							className="svg-qm"
							fill="#666666"
							d="M11.907,15.096c0.004-0.547,0.085-0.947,0.243-1.201c0.158-0.254,0.474-0.563,0.946-0.926
			c0.277-0.227,0.499-0.471,0.665-0.732s0.249-0.555,0.249-0.879c0-0.359-0.095-0.641-0.284-0.844s-0.46-0.305-0.812-0.305
			c-0.289,0-0.534,0.086-0.735,0.258s-0.304,0.424-0.308,0.756h-1.664l-0.012-0.035c-0.012-0.75,0.235-1.324,0.741-1.723
			s1.165-0.598,1.978-0.598c0.875,0,1.562,0.222,2.06,0.665s0.747,1.046,0.747,1.808c0,0.496-0.146,0.955-0.437,1.377
			s-0.655,0.775-1.093,1.061c-0.238,0.184-0.395,0.369-0.469,0.554s-0.111,0.439-0.111,0.764H11.907z M13.624,17.521h-1.723v-1.465
			h1.723V17.521z"
						/>
						<path
							className="svg-cog"
							fill="#666666"
							d="M24.471,15c0.154,0,0.236-1.198,0.236-2s-0.082-2-0.236-2h-1.813c-0.246-1-0.638-2.138-1.17-3.006
			l1.281-1.366c-0.436-0.656-0.945-1.299-1.502-1.854c-0.553-0.555-1.152-1.087-1.809-1.521l-1.452,1.27
			C17.138,3.991,16,3.587,15,3.342V1.53c0-0.153-1.198-0.237-2-0.237s-2,0.084-2,0.237v1.812c-1,0.245-2.138,0.639-3.004,1.17
			l-1.368-1.28c-0.655,0.435-1.298,0.945-1.854,1.5c-0.553,0.555-1.087,1.155-1.52,1.812l1.268,1.451C3.993,8.862,3.588,10,3.342,11
			H1.533c-0.156,0-0.24,1.198-0.24,2s0.084,2,0.24,2h1.809c0.246,1,0.641,2.138,1.17,3.006l-1.278,1.365
			c0.433,0.656,0.945,1.299,1.498,1.854c0.556,0.555,1.156,1.088,1.812,1.521l1.453-1.269C8.862,22.009,10,22.413,11,22.658v1.812
			c0,0.153,1.198,0.237,2,0.237s2-0.084,2-0.237v-1.812c1-0.245,2.138-0.639,3.007-1.17l1.366,1.279
			c0.656-0.434,1.299-0.945,1.852-1.5c0.557-0.555,1.088-1.154,1.523-1.811l-1.271-1.451C22.01,17.138,22.412,16,22.658,15H24.471z
			 M13,20.5c-4.143,0-7.5-3.357-7.5-7.5c0-4.142,3.357-7.5,7.5-7.5s7.5,3.358,7.5,7.5C20.5,17.143,17.143,20.5,13,20.5z"
						/>
					</svg>
				</div>
				<div className="atp__title">About this Project</div>
			</button>
			<main ref={mainRef}>
				<p>
					Todo 2025 B is a standard Todo app à la TodoMVC with a few extra bells
					and whistles
				</p>
				<p>
					<span>Repo: </span>
					<a
						href="https://github.com/iamgrid/todo-2025-b"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
				</p>
				<h1>Technologies</h1>
				<p>React, Typescript, shadcn/ui, Next.js SSG, Jest, Playwright</p>
				<h1>Cool Parts of the Codebase</h1>
				<p>
					<a
						href="https://github.com/iamgrid/todo-2025-b/blob/master/src/"
						target="_blank"
						rel="noopener noreferrer"
					>
						behavior.js
					</a>
					<span> - </span>See how the NPCs make decisions based on their
					surroundings and state.
				</p>
			</main>
		</div>
	);
}

export default AboutThisProject;
