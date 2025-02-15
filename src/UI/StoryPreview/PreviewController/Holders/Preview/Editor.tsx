import React, { useEffect, useRef } from "@rbxts/react";
import { useWidgetStateContext } from "Context/WidgetStateContext";
import { RemoveExtension } from "Hooks/Reflex/Control/ModuleList/Utils";
import Configs from "Plugin/Configs";
import { useDeferLifetime } from "UI/Holders/LifetimeChildren/LifetimeController";
import { Div } from "UI/Styles/Div";

function Editor(props: StoryHolderProps) {
	const mountRef = useRef<Frame>();
	const widgetState = useWidgetStateContext();

	const offset = props.PreviewEntry.Offset;
	const scale = props.PreviewEntry.Zoom;
	const storyName = RemoveExtension(
		props.PreviewEntry.Module.Name,
		Configs.Extensions.Story
	);
	const onViewport = props.PreviewEntry.OnViewport;

	useDeferLifetime(props, 2);

	useEffect(() => {
		const holder = mountRef.current;
		if (!holder) return;
		if (onViewport) return;
		props.MountFrame.Parent = holder;
	}, [mountRef, onViewport]);

	useEffect(() => {
		if (onViewport) return;
		props.SetCanReload(widgetState.WidgetFocused);
	}, [widgetState.WidgetFocused, props.SetCanReload, onViewport]);

	return (
		<Div
			key={storyName}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={new UDim2(0.5, offset.X, 0.5, offset.Y)}
			ZIndex={props.PreviewEntry.Order}
		>
			<uiscale Scale={scale / 100} />
			<Div key={"Story"} Reference={mountRef} />
		</Div>
	);
}

export default Editor;
