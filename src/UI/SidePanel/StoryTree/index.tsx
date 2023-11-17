import Roact from "@rbxts/roact";
import { useMemo, withHooks } from "@rbxts/roact-hooked";
import { Detector } from "UI/Styles/Detector";
import TopList from "UI/Styles/List/TopList";
import { useSelector } from "@rbxts/roact-reflex";
import { FilterNodes } from "./SearchFilter";
import Unknown from "../Nodes/ChildrenHolder/Unknown";
import { selectNodes } from "Reflex/Explorer/Nodes";
import { selectFilter } from "Reflex/Explorer/Filter";
import Storybook from "../Nodes/ChildrenHolder/Storybook";
import { selectOverlay } from "Reflex/Overlay";

interface StoryTreeProps {}

function setProps(props: StoryTreeProps) {
	return props as Required<StoryTreeProps>;
}

function StoryTreeCreate(setprops: StoryTreeProps) {
	const props = setProps(setprops as Required<StoryTreeProps>);

	const nodes = useSelector(selectNodes).nodes;
	const filter = useSelector(selectFilter).search;
	const overlay = useSelector(selectOverlay);
	const isBlocked = overlay !== undefined;

	const nodeList = useMemo(() => {
		const filteredNodes = filter ? FilterNodes(nodes, filter) : nodes;
		const elementsList: Roact.Element[] = [];
		filteredNodes.storybooks.forEach((node, index) => {
			elementsList.push(<Storybook Order={index} Node={node}></Storybook>);
		});
		filteredNodes.unknown.forEach((node, index) => {
			elementsList.push(<Unknown Order={index} Node={node}></Unknown>);
		});
		return elementsList;
	}, [nodes, filter]);

	return (
		<Detector Key="ScrollerFrame" Size={new UDim2(1, 0, 1, -65)} AnchorPoint={new Vector2(0.5, 0)} LayoutOrder={3}>
			<scrollingframe
				Key={"Scroller"}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				CanvasSize={new UDim2()}
				ScrollBarThickness={2}
				ScrollBarImageTransparency={0.8}
				Active={true}
				ScrollingEnabled={!isBlocked}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
			>
				<TopList HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 1)} />
				{nodeList}
			</scrollingframe>
		</Detector>
	);
}
const StoryTree = withHooks(StoryTreeCreate);

export = StoryTree;
