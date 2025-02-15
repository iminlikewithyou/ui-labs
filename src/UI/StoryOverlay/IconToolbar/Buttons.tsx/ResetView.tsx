import Immut from "@rbxts/immut";
import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import SpriteButton from "UI/Utils/SpriteButton";
import { ToolButtonProps } from "../ToolButtonsList";

function ResetView(props: ToolButtonProps) {
	const { updateMountData } = useProducer<RootProducer>();

	const entry = props.PreviewEntry;

	const OnZoomOut = useCallback(() => {
		updateMountData(entry.Key, (old) =>
			Immut.produce(old, (draft) => {
				draft.Zoom = 100;
				draft.Offset = Vector2.zero;
			})
		);
	}, [entry]);
	return (
		<SpriteButton
			ButtonName={props.ButtonName}
			Sprite="Reload"
			Description="Reset View"
			OnClick={OnZoomOut}
			OnRightClick={props.OnRightClick}
			Order={props.Order}
			Shortcut={Enum.KeyCode.B}
			ShortcutModifier={Enum.ModifierKey.Ctrl}
		/>
	);
}

export default ResetView;
