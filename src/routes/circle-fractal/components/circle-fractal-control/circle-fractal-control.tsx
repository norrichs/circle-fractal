import React, { ChangeEvent, Dispatch, useEffect, useState } from "react";
import styled from "styled-components";
import { useLocalStorage } from "../../../../utils/use-local-storage/use-local-storage";
import {
	CircleFractalConfig,
	generateCircles,
	LevelParam,
	getRGBA,
	RGBA,
	defaultConfig,
} from "../../lib/generate-circles";
import { CFAction } from "../../lib/use-circle-fractal";
import { CompoundControl, CompoundControlAction, useCompoundControl } from "./compound-control";
import { ControlContainer } from "./control-fractal.styles";
import { LevelControl } from "./level-control";



const ControlHeader = styled.header`
  display: flex;
  flex-direction: row;
	justify-content: space-between;
  `;

const ControlSection = styled.section`
	position: absolute;
`;
const ControlButton = styled.button<{ show: boolean }>`
	display: ${({ show }) => (show ? "inline" : "none")};
	margin: 20px;
`;

const GlobalControls = styled.section`
  display: flex;
  flex-direction: column;
`;
const LevelControls = styled.section`
  display: flex;
  flex-direction: row;
`;
const Control = styled.div`
  display: flex;
  gap: 10px;
`;
const RadioRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  & span:first-of-type {
    width: 50px;
  }
`;
const ControlFooter = styled.footer`
	opacity: 0;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 60px;

	border: none;
	backdrop-filter: blur(20px);

	transition: 600ms;

	&:hover {
		opacity: 1;
		transition: 300ms;
	}
`;
const ButtonGroup = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 10px;
	padding: 10px 0;
`;

const SmallList = styled.ul`
	border: 1px solid cornflowerblue;
	padding: 5px;
	font-family: monospace;
	max-width: 400px;
	overflow-x: hidden;
	& li {
		
		font-size: 10px;
	}
`;
export const Select = styled.div<{show: boolean}>`
  position: absolute;
  left: 20px;
  display: ${({show})=> show ? "flex" : "none"};
  flex-direction: column;
  bottom: 0;
  background-color: dimgray;
  padding: 3px;

  & button {
    box-sizing: border-box;
    background: none;
    color: black;
    border-top: 1px solid cornflowerblue;
    padding: 3px 0;
    border-radius: 0;
  }
  & button:hover {
  }
  & button:first-of-type {
    border-top: none;
  }
`

interface CircleFractalControlsProps {
	circleConfig: CircleFractalConfig;
	circleDispatch: Dispatch<CFAction>;
	compoundControls: CompoundControl[];
	compoundConfigDispatch: Dispatch<CompoundControlAction>;
}

export const CircleFractalControls = ({
	circleConfig,
	circleDispatch,
	compoundControls,
	compoundConfigDispatch,
}: CircleFractalControlsProps) => {
	const [showControls, setShowControls] = useState(true);


	return (
		<ControlSection>
			<ControlContainer show={showControls}>
				<ControlHeader>
					<h3>Controls</h3>
					<button type="button" onClick={() => setShowControls(false)}>
						Close
					</button>
				</ControlHeader>
				<GlobalControls>
					<ButtonGroup>
						{/* <button type="button" onClick={handleSaveConfig}>
							Save config
						</button> */}
					</ButtonGroup>
					<Control>
						<span>r0</span>
						<input
							id="control-r0"
							type="number"
							value={circleConfig.r0}
							onChange={(e) => {
								circleDispatch({ type: "r0", payload: Number(e.target.value) });
							}}
						/>
					</Control>
					<div>
						<h4>Alignment</h4>
						<RadioRow>
							<span>Parent</span>
							<input
								type="radio"
								value={"inner"}
								checked={circleConfig.alignment.parent === "inner"}
								onChange={(e) =>
									circleDispatch({
										type: "alignment",
										payload: { ...circleConfig.alignment, parent: "inner" },
									})
								}
							/>
							<input
								type="radio"
								value={"center"}
								checked={circleConfig.alignment.parent === "center"}
								onChange={(e) =>
									circleDispatch({
										type: "alignment",
										payload: { ...circleConfig.alignment, parent: "center" },
									})
								}
							/>
							<input
								type="radio"
								value={"outer"}
								checked={circleConfig.alignment.parent === "outer"}
								onChange={(e) =>
									circleDispatch({
										type: "alignment",
										payload: { ...circleConfig.alignment, parent: "outer" },
									})
								}
							/>
							<span>{circleConfig.alignment.parent}</span>
						</RadioRow>
						<RadioRow>
							<span>Child</span>
							<input
								type="radio"
								value={"inner"}
								checked={circleConfig.alignment.child === "inner"}
								onChange={(e) =>
									circleDispatch({
										type: "alignment",
										payload: { ...circleConfig.alignment, child: "inner" },
									})
								}
							/>
							<input
								type="radio"
								value={"center"}
								checked={circleConfig.alignment.child === "center"}
								onChange={(e) =>
									circleDispatch({
										type: "alignment",
										payload: { ...circleConfig.alignment, child: "center" },
									})
								}
							/>
							<input
								type="radio"
								value={"outer"}
								checked={circleConfig.alignment.child === "outer"}
								onChange={(e) =>
									circleDispatch({
										type: "alignment",
										payload: { ...circleConfig.alignment, child: "outer" },
									})
								}
							/>
							<span>{circleConfig.alignment.child}</span>
						</RadioRow>
					</div>
					<Control>
						<span>Draw Mode</span>
						<input
							type="checkbox"
							value={circleConfig.drawMode}
							checked={circleConfig.drawMode === "circle"}
							onChange={(e) =>
								circleDispatch({
									type: "drawMode",
									payload: e.target.checked ? "circle" : "path",
								})
							}
						/>
						<span>{circleConfig.drawMode}</span>
					</Control>
					<Control>
						<span>width function?</span>
					</Control>
					<Control>
						<span>color function?</span>
					</Control>

					<Control>
						<span>Add level</span>
						<button
							type="button"
							onClick={() => {
								circleDispatch({
									type: "addLevel",
									payload: circleConfig.levelParams.length,
								});
							}}
						>
							+
						</button>
					</Control>
					<SmallList>
						{compoundControls.map((compoundControl) => (
							<li key={`compoundControl-${compoundControl.id}`}>
								<div>
									<span>
										{`Control ID/value: ${compoundControl.id}/${compoundControl.value}  SubControls: `}
									</span>
										{compoundControl.config.map(subControl => {
											const levelParam = circleConfig.levelParams[subControl.level]
											return <span key={`subControl-${subControl.id}`}>{`[ lvl: ${subControl.level}, key: ${subControl.key}, value: ${levelParam[subControl.key]}]`}</span>
										})}
								</div>
							</li>
						))}
					</SmallList>
				</GlobalControls>
				<LevelControls>
					{circleConfig.levelParams.map((levelParam, level) => {
						return (
							<LevelControl
								key={`level-${level}`}
								config={circleConfig}
								compoundConfig={{
									controls: compoundControls,
									dispatch: compoundConfigDispatch,
								}}
								level={level}
								levelParam={levelParam}
								dispatch={circleDispatch}
							/>
						);
					})}
				</LevelControls>
			</ControlContainer>
			<ControlButton
				type="button"
				show={!showControls}
				onClick={() => setShowControls(true)}
			>
				Show Controls
			</ControlButton>
			<ControlFooter>
				{compoundControls.map((compoundControl) => (
					<CompoundControlContainer key={compoundControl.id}>
						<CompoundControl
							compoundControl={compoundControl}
							onChange={(value: number) => compoundConfigDispatch({type: "controlValue", payload: {controlId: compoundControl.id, value}})}
							circlesConfig={circleConfig}
							dispatch={circleDispatch}
						/>
					</CompoundControlContainer>
				))}
			</ControlFooter>
		</ControlSection>
	);
};

const CompoundControlContainer = styled.div`
	padding: 0 10px;
	border-radius: 3px;
	display: flex;
	flex-direction: row;
	width: 100%;

	& div {
		width: 100%;
	}
	& input[type="range"] {
		width: calc(100% - 20px);
	}
`;
