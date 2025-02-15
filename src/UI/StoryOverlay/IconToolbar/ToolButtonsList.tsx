import Explorer from "./Buttons.tsx/Explorer";
import FullscreenMode from "./Buttons.tsx/FullscreenMode";
import LightBackground from "./Buttons.tsx/LightBackground";
import MeasureTool from "./Buttons.tsx/MeasureTool";
import MouseRules from "./Buttons.tsx/MouseRules";
import Reload from "./Buttons.tsx/Reload";
import ResetZoom from "./Buttons.tsx/ResetZoom";
import SelectElements from "./Buttons.tsx/SelectElements";
import ShowOutlines from "./Buttons.tsx/ShowOutlines";
import Viewport from "./Buttons.tsx/Viewport";
import ZoomIn from "./Buttons.tsx/ZoomIn";
import ZoomOut from "./Buttons.tsx/ZoomOut";

type ToolButtonsList = typeof ToolButtonsList;
export type ToolButtonType = ToolButtonsList[number]["Name"];

export interface ToolButtonProps {
	OnRightClick: () => void;

	PreviewEntry: PreviewEntry;
	ButtonName: ToolButtonType;
	Order: number;
}

interface ButtonListEntry {
	Name: ToolButtonType;
	DisplayName: string;
	Render: (props: ToolButtonProps) => JSX.Element;
}

export const ToolButtonsList = [
	{ Name: "Reload", Render: Reload, DisplayName: "Reload" },
	{ Name: "ZoomIn", Render: ZoomIn, DisplayName: "Zoom In" },
	{ Name: "ZoomOut", Render: ZoomOut, DisplayName: "Zoom Out" },
	{ Name: "ResetZoom", Render: ResetZoom, DisplayName: "Reset Zoom" },
	{ Name: "ViewOnViewport", Render: Viewport, DisplayName: "View On Viewport" },
	{ Name: "ViewOnExplorer", Render: Explorer, DisplayName: "View On Explorer" },
	{ Name: "FullscreenMode", Render: FullscreenMode, DisplayName: "Fullscreen Mode" },
	{ Name: "LightBackground", Render: LightBackground, DisplayName: "Invert Background" },
	{ Name: "MeasureTool", Render: MeasureTool, DisplayName: "Measure Tool" },
	{ Name: "SelectElements", Render: SelectElements, DisplayName: "Select Elements" },
	{ Name: "ShowOutlines", Render: ShowOutlines, DisplayName: "Show Outlines" },
	{ Name: "MouseRules", Render: MouseRules, DisplayName: "Mouse Rules" },
] as const;

export const ToolButtonNames = ToolButtonsList.reduce(
	(old, button) => {
		old[button.Name] = button;
		return old;
	},
	{} as Record<ToolButtonType, ButtonListEntry>,
);
