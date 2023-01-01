import React from "react";
import styled from "styled-components";
import {
	CircleFractalConfig,
	Circle,
	Fill,
	generateCircles,
	getRGBA,
} from "../lib/generate-circles";

const PageMain = styled.main`
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.1);
`;
const CircleFractalContainer = styled.div`
  	position: relative;
		background-color: transparent;
		border-radius: 50%;
    --margin-y: 60px;
    --margin-x: 30px;
    margin: var(--margin-y) var(--margin-x);
    /* border: 1px solid red; */
    height: calc(100% - var(--margin-y) * 2);
    width: 100%;
    overflow: visible;

    & svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      fill: none;
      height: 100%;
      border-radius: 50%;
      overflow: visible;
    }
`;

export const CircleFractal = ({ config }: { config: CircleFractalConfig }) => {
	const circles: Circle[] = generateCircles(config);
	const { r0, drawMode } = config;

	return (
		<PageMain>
			<CircleFractalContainer>
				<svg
					viewBox={`${-(r0 + 5)} ${-(r0 + 5)} ${r0 * 2 + 10} ${r0 * 2 + 10}`}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
				>
					{drawMode === "circle"
						? circles.map((c, i) => {
								return (
									<circle
										key={`circle-${i}`}
										cx={c.x}
										cy={c.y}
										r={c.r}
										stroke={c.of ? getRGBA(c.of) : "none"}
										fill={c.if ? getRGBA(c.if) : "none"}
										strokeWidth={c.w}
									/>
								);
						  })
						: circles.map((c, i) => {
								return (
									<path
										stroke="none"
										fill={c.of ? getRGBA(c.of) : "none"}
										fill-rule="evenodd"
										d={`
											M ${c.x} ${c.y}
											m ${c.r + c.w / 2} 0
											a ${c.r + c.w / 2} ${c.r + c.w / 2} 1 1 1 ${
														-2 * (c.r + c.w / 2)
													} 0
											a ${c.r + c.w / 2} ${c.r + c.w / 2} 1 1 1 ${2 * (c.r + c.w / 2)} 0
											m ${-c.w} 0
											a ${c.r - c.w / 2} ${c.r - c.w / 2} 1 1 1 ${
														-2 * (c.r - c.w / 2)
													} 0
											a ${c.r - c.w / 2} ${c.r - c.w / 2} 1 1 1 ${2 * (c.r - c.w / 2)} 0
											Z
										`}
									/>
								);
						  })}
				</svg>
			</CircleFractalContainer>
		</PageMain>
	);
};
