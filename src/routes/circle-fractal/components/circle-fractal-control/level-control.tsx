import React, {Dispatch, useState} from "react";
import styled from "styled-components";

import { CircleFractalConfig, LevelParam, generateCircles, getRGBA, RGBA, Circle } from "../../lib/generate-circles";
import { CFAction } from "../../lib/use-circle-fractal";
import { Overlay, ControlContainer } from "./control-fractal.styles";
import { NumberRangeInput } from "./number-range-input";
import { ColorPicker } from "./color-picker";
import { CompoundableControl, CompoundableParams, CompoundControl, CompoundControlAction, CompoundConfig } from "./compound-control";
import { SubControlConfigBox, ConfigBox } from "./sub-control-config-box";


const LevelControlContainer = styled.div`
  border: 1px solid dimgray;
  border-radius: 3px;
	position: relative;
`;

const LevelDisplay = styled.div<{ dimension: number }>`
  background-color: #343434;
	display: flex;
	flex-direction: row;
	justify-content: center;

  & button {
		background: transparent;
    position: relative;
    padding: 0;
    width: ${({ dimension }) => dimension}px;
    height: ${({ dimension }) => dimension}px;
    display: flex;
    place-items: center center;
  }
  & svg {

    width: 100%;
    height: ${({ dimension }) => dimension}px;
    margin: 0;
    fill: none;
    height: 100%;
    border-radius: 50%;
  }
`;

export const LevelControl = ({
	config,
	compoundConfig,
	levelParam,
	level,
	dispatch,
}: {
	config: CircleFractalConfig;
	compoundConfig: {
		controls: CompoundControl[];
		dispatch: Dispatch<CompoundControlAction>
	};
	levelParam: LevelParam;
	level: number;
	dispatch: Dispatch<CFAction>;
}) => {
	const l = levelParam;
	const [showControl, setShowControl] = useState(false);
	const [showCompoundSubControlConfig, setShowCompundSubControlConfig] = useState(false)
	const [activeCompoundControlId, setActiveCompundControlId] = useState<number>(-1)
	const [activeCompoundSubControlParamKey, setActiveCompoundSubControlParamKey] = useState<CompoundableParams | null>(null)

	const levelConfig: CircleFractalConfig = {
		...config,
		r0: 1000, //showControl ? 100 : 30,
		levelParams:
			level === 0
				? [config.levelParams[0]]
				: [config.levelParams[level - 1], config.levelParams[level]],
	};
	const levelDisplayPadding = 2;
	const levelCircles = generateCircles(levelConfig);

	const getActiveSubControlConfig = (compoundControlId: number, paramKey: CompoundableParams): CompoundConfig | null => {
		console.debug("activeCompoundControlId", activeCompoundControlId, "config", compoundConfig?.controls
			?.find((c) => c.id === activeCompoundControlId)
			?.config?.find((sc) => sc.level === level && sc.key === paramKey))
		return compoundConfig?.controls
			?.find((c) => c.id === activeCompoundControlId)
			?.config?.find((sc) => sc.level === level && sc.key === paramKey) || null;
  }

	const handleClickCompoundSubControlConfig = (controlId: number, paramKey: CompoundableParams) => {
		setShowCompundSubControlConfig(!showCompoundSubControlConfig)
		setActiveCompoundSubControlParamKey(paramKey)
		setActiveCompundControlId(controlId)
	}

	const getCompoundIds = (key: CompoundableParams, level: number, controls: CompoundControl[]): number[] => {
		return controls.filter(c => c.config.some(sc => sc.key === key && sc.level === level)).map(c => c.id)
	}

	return (
		<LevelControlContainer>
			<LevelDisplay dimension={showControl ? 200 : 60}>
				<div style={{ position: "relative" }}>
					<button type="button" onClick={() => setShowControl(!showControl)}>
						<svg
							viewBox={`-${levelConfig.r0 + levelDisplayPadding} -${
								levelConfig.r0 + levelDisplayPadding
							} ${(levelConfig.r0 + levelDisplayPadding) * 2} ${
								(levelConfig.r0 + levelDisplayPadding) * 2
							}`}
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
						>
							{levelCircles.map((c: Circle, i) => {
								return (
									<circle
										key={`circle-${i}`}
										cx={c.x}
										cy={c.y}
										r={c.r}
										stroke={getRGBA(c.of)}
										strokeWidth={c.w}
										fill={c.if ? getRGBA(c.if) : "none"}
									/>
								);
							})}
						</svg>
						<Overlay top="50%" left="50%">
						<h3
							style={{
								margin: "0",
								position: "absolute",
								transform: "translate(-50%, -50%)",
							}}
						>
							{level}
						</h3>
					</Overlay>
					</button>

					<Overlay top="0px" left="100%">
						<input
							style={{ transform: "translateX(-100%)" }}
							type="checkbox"
							value="visible"
							checked={levelParam.visible}
							onChange={(e) =>
								dispatch({
									type: "visible",
									payload: { level, visible: e.target.checked },
								})
							}
						/>
					</Overlay>
				</div>
			</LevelDisplay>
			<ControlContainer show={showControl}>
				<header>
					<span>Level: {level}</span>
					<input
						type="checkbox"
						value="visible"
						checked={levelParam.visible}
						onChange={(e) =>
							dispatch({
								type: "visible",
								payload: { level, visible: e.target.checked },
							})
						}
					/>
				</header>
				{level > 0 && (
					<CompoundableControl paramKey="symmetry" level={level} configuredCompoundIds={getCompoundIds("symmetry", level, compoundConfig.controls)}	compoundConfig={compoundConfig} onClick={handleClickCompoundSubControlConfig}>
						<NumberRangeInput
							label="Sym"
							inputMin={1}
							inputMax={32}
							inputStep={1}
							inputValue={levelParam.symmetry}
							onChangeFn={(e) =>
								dispatch({
									type: "symmetry",
									payload: { level: level, symmetry: Number(e.target.value) },
								})
							}
						/>
					</CompoundableControl>
				)}
				<button
					type="button"
					onClick={() => {
						dispatch({ type: "removeLevel", payload: level });
					}}
				>
					-
				</button>
				<CompoundableControl paramKey="width" level={level}	configuredCompoundIds={getCompoundIds("width", level, compoundConfig.controls)} compoundConfig={compoundConfig} onClick={handleClickCompoundSubControlConfig}>
					<NumberRangeInput
						label="Width"
						inputMin={0}
						inputMax={config.r0 / Math.pow(2, level - 1)}
						inputStep={1}
						inputValue={levelParam.width}
						onChangeFn={(e) =>
							dispatch({
								type: "width",
								payload: { level: level, width: Number(e.target.value) },
							})
						}
					/>
				</CompoundableControl>
				<CompoundableControl paramKey="angle" level={level} configuredCompoundIds={getCompoundIds("angle", level, compoundConfig.controls)}	compoundConfig={compoundConfig} onClick={handleClickCompoundSubControlConfig}>
					<NumberRangeInput
						label="Angle"
						inputMin={0}
						inputMax={360 / levelParam.symmetry}
						inputValue={levelParam.angle}
						inputStep={1}
						onChangeFn={(e) =>
							dispatch({
								type: "angle",
								payload: { level, angle: Number(e.target.value) },
							})
						}
					/>
				</CompoundableControl>
				<ColorPicker
					label="Outer"
					color={levelParam.outerFill}
					colorDispatch={(newColorValue: number, newValueKey: keyof RGBA) => {
						const newRGBA = { ...levelParam.outerFill };
						newRGBA[newValueKey] = newColorValue;
						dispatch({ type: "outerFill", payload: { level, rgba: newRGBA } });
					}}
					/>
				<ColorPicker
					label="Inner"
					color={levelParam.innerFill || { r: 0, g: 0, b: 0, a: 1 }}
					colorDispatch={(newColorValue: number, newValueKey: keyof RGBA) => {
						const newRGBA = levelParam.innerFill
							? { ...levelParam.innerFill }
							: { r: 0, g: 0, b: 0, a: 1 };
						newRGBA[newValueKey] = newColorValue;
						dispatch({ type: "innerFill", payload: { level, rgba: newRGBA } });
					}}
				/>
			</ControlContainer>
			{compoundConfig.controls.length > 0 && activeCompoundSubControlParamKey && activeCompoundControlId >= 0 && (
        <ConfigBox show={showCompoundSubControlConfig} controlId={activeCompoundControlId}>
          <SubControlConfigBox
            controlId={activeCompoundControlId}
						controlIds={compoundConfig.controls.map(c=>c.id)}
						paramKey={activeCompoundSubControlParamKey}
            getSubControlConfig={getActiveSubControlConfig}
						subControlConfig={getActiveSubControlConfig(activeCompoundControlId, activeCompoundSubControlParamKey)}
            subControlDispatch={compoundConfig.dispatch}
						close={()=>setShowCompundSubControlConfig(false)}
          />
        </ConfigBox>
			)}
		</LevelControlContainer>
	);
};