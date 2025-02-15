import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";

function ResetZoom(props: ToolButtonProps) {
	const { setZoom } = useProducer<RootProducer>();

	const entry = props.PreviewEntry;

	const OnZoomOut = useCallback(() => {
		setZoom(entry.Key, 100);
	}, [entry]);
	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="Reload"
			Description="Reset Zoom"
			OnClick={OnZoomOut}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
			Shortcut={Enum.KeyCode.Zero}
			ShortcutModifier={Enum.ModifierKey.Ctrl}
		/>
	);
}

export default ResetZoom;
