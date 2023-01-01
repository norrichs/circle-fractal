import { ChangeEvent } from "react";
import styled from "styled-components";

const NumberInput = styled.input`
  border: none;
  background: none;
`;
const RangeInput = styled.input``;

interface NumberRangeInputProps {
	label: string;
	inputMin: number;
	inputMax: number;
	inputStep: number;
	inputValue: number;
	onChangeFn: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const NumberRangeInput = ({
	label,
	inputMin,
	inputMax,
	inputStep,
	inputValue,
	onChangeFn,
}: NumberRangeInputProps) => {
	return (
		<div>
			<span>{label}</span>
			<RangeInput
				type="range"
				min={inputMin}
				max={inputMax}
				step={inputStep}
				value={inputValue}
				onChange={onChangeFn}
			/>
			<NumberInput
				type="number"
				min={inputMin}
				max={inputMax}
				step={inputStep}
				value={inputValue}
				onChange={onChangeFn}
			/>
		</div>
	);
};
