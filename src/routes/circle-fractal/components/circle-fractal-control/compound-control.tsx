import { Dispatch, useEffect, useState, ReactNode, useReducer } from "react";
import styled from "styled-components";

import { CFAction } from "../../lib/use-circle-fractal";
import { CircleFractalConfig } from "../../lib/generate-circles";
import { NumberRangeInput } from "./number-range-input";
import { Select } from "./circle-fractal-control";

const Control = styled.div`
  display: flex;
  gap: 10px;
`;

export interface CompoundConfig {
	id: number;
	level: number;
	key: CompoundableParams;
	min: number;
	max: number;
	ratio: number;
}

export type CompoundableParams =
	| "angle"
	| "innerFill"
	| "outerFill"
	| "width"
	| "symmetry";

export const CompoundControl = ({
	compoundControl,
	dispatch,
	circlesConfig,
	onChange,
}: {
	compoundControl: CompoundControl;
	dispatch: Dispatch<CFAction>;
	circlesConfig: CircleFractalConfig;
	onChange: (value: number) => void;
}) => {
	const [compoundConfig, setCompoundConfig] = useState<CompoundConfig[]>([]);

	const handleCompoundChanges = (config: CompoundConfig) => {
		let { key, level, min, max, ratio } = config;
		switch (key) {
			case "angle":
				dispatch({
					type: key,
					payload: {
						level,
						angle: (min + (max - min) * compoundControl.value) * ratio,
					},
				});
				break;
			case "width":
				dispatch({
					type: key,
					payload: {
						level,
						width: (min + (max - min) * compoundControl.value) * ratio,
					},
				});
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (compoundControl.config.length > 0) {
			compoundControl.config.forEach((compoundConfig) =>
				handleCompoundChanges(compoundConfig),
			);
		}
	}, [compoundControl.value]);
	return (
		<Control>
			<NumberRangeInput
				label=""
				inputMin={0}
				inputMax={1}
				inputStep={0.001}
				inputValue={compoundControl.value}
				// onChangeFn={(e) => compoundConfigDispatch({type: "controlValue", payload: {controlId: }})}
				onChangeFn={(e) => onChange(Number(e.target.value))}
			/>
		</Control>
	);
};
export const compoundColors = [
	{ border: "#bb5555", background: "#993333" },
	{ border: "#5555bb", background: "#333399" },
	{ border: "#55bb55", background: "#339933" },
	{ border: "#666622", background: "#444400" },
	{ border: "#662266", background: "#440044" },
	{ border: "#226666", background: "#004444" },
];

const CompoundableContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
`;

const SelectBox = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  top: 0px;
  left: calc(100% + 4px);
  padding: 4px;
  border-radius: 8px;
  background-color: gray;
  box-shadow: 0 0 10px 0px black;

  
  
  & button {
    padding: 2px 8px;
    border-top: 2px solid cornflowerblue; 
    background: none;
    border-radius: 0;

  }
   & button:first-of-type {
    border-top: none;
   }
`;
const CircleButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
`;
const CircleButton = styled.button<{ compId?: number }>`
  --size: 30px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  border: 2px solid ${({ compId }) =>
		compId === undefined
			? "#333333"
			: compoundColors[compId % compoundColors.length].border};
  background: ${({ compId }) =>
		compId === undefined
			? "#333333"
			: compoundColors[compId % compoundColors.length].background};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: calc(var(--size) * (-1.7))
`;

export interface CompoundControl {
	id: number;
	name?: string;
	value: number;
	active: boolean;
	config: CompoundConfig[] | [];
}

export const CompoundableControl = ({
	paramKey,
	level,
	children,
	configuredCompoundIds,
	compoundConfig,
	onClick,
}: {
	paramKey: CompoundableParams;
	level: number;
	children: ReactNode;
	configuredCompoundIds: number[];
	compoundConfig: {
		controls: CompoundControl[];
		dispatch: Dispatch<CompoundControlAction>;
	};
	onClick: (controlId: number, paramKey: CompoundableParams) => void;
}) => {
	const [showAddMenu, setShowAddMenu] = useState(false);
	const unassignedCompoundControls = () => compoundConfig.controls.filter((c) => !configuredCompoundIds.includes(c.id))

	return (
		<CompoundableContainer>
			{children}
			<CircleButtonContainer>
				<CircleButton
					type="button"
					onClick={() => {
						if (unassignedCompoundControls().length === 0) {
							compoundConfig.dispatch({type: "add", payload: {level, paramKey}})
						} else {
							setShowAddMenu(!showAddMenu);
						}
					}}
				>
					+
				</CircleButton>

				{configuredCompoundIds.map((id) => (
					<CircleButton
						key={id}
						compId={id}
						type="button"
						onClick={() => {
							console.debug("clicked circle button", id);
							onClick(id, paramKey);
						}}
					>
						{id}
					</CircleButton>
				))}
			</CircleButtonContainer>
			<Select show={showAddMenu}>
				{unassignedCompoundControls().map((c) => (
						<button
							type="button"
							onClick={() => {
								setShowAddMenu(false);
								compoundConfig.dispatch({
									type: "add",
									payload: {
										existingCompoundControlId: c.id,
										level,
										paramKey,
									},
								});
							}}
						>
							{c.id}
						</button>
					))}
				<button
					type="button"
					onClick={() =>{
						setShowAddMenu(false)
						compoundConfig.dispatch({
							type: "add",
							payload: { level, paramKey },
						})
					}}
				>
					New
				</button>
			</Select>
		</CompoundableContainer>
	);
};

export const compoundableParamRanges = {
	angle: { min: 0, max: 360, ratioMin: -10, ratioMax: 10 },
	innerFill: { min: 0, max: 255, ratioMin: 0, ratioMax: 10 },
	outerFill: { min: 0, max: 255, ratioMin: 0, ratioMax: 10 },
	width: { min: 0, max: 100, ratioMin: 0, ratioMax: 10 },
	symmetry: { min: 1, max: 32, ratioMin: 0, ratioMax: 10 },
};

export type CompoundControlAction =
	| { type: "config"; newConfig: CompoundControl[] }
	| {
			type: "add";
			payload: {
				existingCompoundControlId?: number;
				msg?: string;
				level: number;
				paramKey: CompoundableParams;
			};
	  } // Add a new parameter to an existing compound controller, or create new compound controller
	| { type: "remove"; payload: { controlId: number; subControlId?: number }}
	| { type: "controlValue"; payload: { controlId: number; value: number } }
	| {
			type: "configSubControl";
			payload: {
				controlId: number;
				subControlId: number;
				min?: number;
				max?: number;
				ratio?: number;
			};
	  }
	| {
			type: "moveSubControl";
			payload: {
				currentControlId: number;
				newControlId: number;
				currentSubControlId: number;
			};
	  }
	| {
			type: "moveSubControlToNew";
			payload: {
				currentControlId: number;
				currentSubControlId: number;
			};
	  };

const compoundControlReducer = (
	prevState: CompoundControl[],
	action: CompoundControlAction,
): CompoundControl[] => {
	let index;
	let subIndex;
	switch (action.type) {
		case "config":
			return [...action.newConfig];
		case "add":
			if (action.payload.msg) {
				console.debug("action.payload.msg", action.payload.msg);
			} else {
				console.debug("no message");
			}
			if (
				!action.payload.existingCompoundControlId &&
				action.payload.existingCompoundControlId !== 0
			) {
				console.debug("no existing controlId specified, creating new");
				return [
					...prevState,
					{
						id:
							prevState.length === 0
								? 0
								: Math.max(...prevState.map((cc) => cc.id)) + 1,
						value: 0.5,
						active: true,
						config: [
							{
								id: 0,
								key: action.payload.paramKey,
								level: action.payload.level,
								min: compoundableParamRanges[action.payload.paramKey].min,
								max: compoundableParamRanges[action.payload.paramKey].max,
								ratio: 1,
							},
						],
					},
				];
			} else {
				const index = prevState.findIndex(
					(control) => control.id === action.payload.existingCompoundControlId,
				);
				return [
					...prevState.slice(0, index),
					{
						id: prevState[index].id,
						value: prevState[index].value,
						active: prevState[index].active,
						config: [
							...prevState[index].config,
							{
								id:
									Math.max(
										...prevState[index].config.map(
											(subControl) => subControl.id,
										),
									) + 1,
								level: action.payload.level,
								key: action.payload.paramKey,
								min: compoundableParamRanges[action.payload.paramKey].min,
								max: compoundableParamRanges[action.payload.paramKey].max,
								ratio: 1,
							},
						],
					},
					...prevState.slice(index + 1),
				];
			}

		case "remove":
			index = prevState.findIndex(c => c.id === action.payload.controlId)
			if ( action.payload.subControlId !== undefined) {
				subIndex = prevState[index].config.findIndex(sc => sc.id === action.payload.subControlId)
			}
			return subIndex === undefined ? [
				...prevState.slice(0, index),
				...prevState.slice(index + 1),
			] : [
				...prevState.slice(0, index),
				{...prevState[index], config: [
					...prevState[index].config.slice(0, subIndex),
					...prevState[index].config.slice(subIndex + 1)
				]},
				...prevState.slice(index + 1)
			]
		case "controlValue":
			index = prevState.findIndex((c) => c.id === action.payload.controlId);
			return [
				...prevState.slice(0, index),
				{ ...prevState[index], value: action.payload.value },
				...prevState.slice(index + 1),
			];
		case "configSubControl":
			index = prevState.findIndex((c) => c.id === action.payload.controlId);
			subIndex = prevState[index].config.findIndex(
				(sc) => sc.id === action.payload.subControlId,
			);
			const newConfig = { ...prevState[index].config[subIndex] };
			if (action.payload.min) {
				if (action.payload.min > newConfig.max) {
					newConfig.max = action.payload.min;
				}
				newConfig.min = action.payload.min;
			} else if (action.payload.max) {
				if (action.payload.max < newConfig.min) {
					newConfig.min = action.payload.max;
				}
				newConfig.max = action.payload.max;
			} else if (action.payload.ratio) {
				newConfig.ratio = action.payload.ratio;
			}

			return [
				...prevState.slice(0, index),
				{
					...prevState[index],
					config: [
						...prevState[index].config.slice(0, subIndex),
						{ ...newConfig },
						...prevState[index].config.slice(subIndex + 1),
					],
				},
				...prevState.slice(index + 1),
			];
		case "moveSubControl":
			const currentIndex = prevState.findIndex(
				(c) => c.id === action.payload.currentControlId,
			);
			const newIndex = prevState.findIndex(
				(c) => c.id === action.payload.newControlId,
			);
			const currentSubIndex = prevState[currentIndex].config.findIndex(
				(sc) => sc.id === action.payload.currentSubControlId,
			);

			const movingSubControl = {
				...prevState[currentIndex].config[currentSubIndex],
			};
			movingSubControl.id =
				Math.max(...prevState[newIndex].config.map((sc) => sc.id)) + 1;

			const sourceControl = {
				...prevState[currentIndex],
				config: [
					...prevState[currentIndex].config.slice(0, currentSubIndex),
					...prevState[currentIndex].config.slice(currentSubIndex + 1),
				],
			};

			const newState = [
				...prevState.slice(0, currentIndex),
				{ ...sourceControl },
				...prevState.slice(currentIndex + 1),
			];

			return [
				...newState.slice(0, newIndex),
				{
					...newState[newIndex],
					config: [...newState[newIndex].config, { ...movingSubControl }],
				},
				...newState.slice(newIndex + 1),
			];
		case "moveSubControlToNew":
			return handleMoveSubControlToNew(prevState, action.payload);
		default:
			return [...prevState];
	}
};

const handleMoveSubControlToNew = (
	prevState: CompoundControl[],
	payload: { currentControlId: number; currentSubControlId: number },
) => {
	// add new control
	const stateWithNewControl = [
		...prevState,
		{
			id:
				prevState.length === 0
					? 0
					: Math.max(...prevState.map((cc) => cc.id)) + 1,
			value: 0.5,
			active: true,
			config: [],
		},
	];
	const newIndex = stateWithNewControl.length - 1;
	const currentIndex = stateWithNewControl.findIndex(
		(c) => c.id === payload.currentControlId,
	);
	const currentSubIndex = stateWithNewControl[currentIndex].config.findIndex(
		(sc) => sc.id === payload.currentSubControlId,
	);

	const movingSubControl = {
		...stateWithNewControl[currentIndex].config[currentSubIndex],
	};
	movingSubControl.id =
		Math.max(...stateWithNewControl[newIndex].config.map((sc) => sc.id)) + 1;

	const sourceControl = {
		...stateWithNewControl[currentIndex],
		config: [
			...stateWithNewControl[currentIndex].config.slice(0, currentSubIndex),
			...stateWithNewControl[currentIndex].config.slice(currentSubIndex + 1),
		],
	};

	const newState = [
		...stateWithNewControl.slice(0, currentIndex),
		{ ...sourceControl },
		...stateWithNewControl.slice(currentIndex + 1),
	];

	return [
		...newState.slice(0, newIndex),
		{
			...newState[newIndex],
			config: [...newState[newIndex].config, { ...movingSubControl }],
		},
		...newState.slice(newIndex + 1),
	];
};

export const useCompoundControl = () => {
	const [compoundControls, compoundConfigDispatch] = useReducer(
		compoundControlReducer,
		[],
	);

	return { compoundControls, compoundConfigDispatch };
};
