import styled from "styled-components";
import { RGBA } from "../../lib/generate-circles";
import { NumberRangeInput } from "./number-range-input";


interface ColorPickerProps {
  color: RGBA;
  label: string;
  colorDispatch: (newColorValue: number, newValueType: keyof RGBA) => void
}

const ColorControl = styled.div`
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  & header {
    text-align: start;
  }

  & div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

`;

export const ColorPicker = ({
	color,
	colorDispatch,
	label,
}: {
	colorDispatch: (newColorValue: number, newValueType: keyof RGBA) => void;
	color: RGBA;
	label: string;
}) => {
	return (
		<ColorControl>
			<header>{label}</header>
			<NumberRangeInput
				label="R"
				inputMin={0}
				inputMax={255}
				inputStep={1}
				inputValue={color.r}
				onChangeFn={(e) => colorDispatch(Number(e.target.value), "r")}
			/>
			<NumberRangeInput
				label="G"
				inputMin={0}
				inputMax={255}
				inputStep={1}
				inputValue={color.g}
				onChangeFn={(e) => colorDispatch(Number(e.target.value), "g")}
			/>
			<NumberRangeInput
				label="B"
				inputMin={0}
				inputMax={255}
				inputStep={1}
				inputValue={color.b}
				onChangeFn={(e) => colorDispatch(Number(e.target.value), "b")}
			/>
			<NumberRangeInput
				label="A"
				inputMin={0}
				inputMax={1}
				inputStep={0.01}
				inputValue={color.a}
				onChangeFn={(e) => colorDispatch(Number(e.target.value), "a")}
			/>
		</ColorControl>
	);
};