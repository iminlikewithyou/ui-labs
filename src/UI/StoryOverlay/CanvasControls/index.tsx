import Immut from "@rbxts/immut";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, {
	useBinding,
	useCallback,
	useEffect,
	useState
} from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { useInputBegan, useInputEnded } from "Hooks/Context/UserInput";
import { useToggler } from "Hooks/Utils/Toggler";
import { Div } from "UI/Styles/Div";

interface CanvasControlsProps {
	PreviewEntry: PreviewEntry;
}

function CanvasControls(props: CanvasControlsProps) {
	const [mousePos, setMousePos] = useBinding<Vector2>(new Vector2());
	const [inside, insideApi] = useToggler(false);
	const [middleClicked, setMiddleClicked] = useState(false);
	const [leftClicked, setLeftClicked] = useState(false);
	const [mouseDragging, setMouseDragging] = useState(false);
	const [shiftClicked, setShiftClicked] = useState(false);
	const [ctrlClicked, setCtrlClicked] = useState(false);

	const inputEnded = useInputEnded();
	const inputBegan = useInputBegan();
	const { updateMountData, zoomByMultiplier } = useProducer<RootProducer>();

	const OnInputChanged = useCallback(
		(_: Frame, input: InputObject) => {
			if (input.UserInputType === Enum.UserInputType.MouseMovement) {
				setMousePos(new Vector2(input.Position.X, input.Position.Y));
			} else if (input.UserInputType === Enum.UserInputType.MouseWheel) {
				if (ctrlClicked) {
					const holder = props.PreviewEntry.Holder;
					let cursorRelativeToDivCenter: Vector2 | undefined;
					if (holder) {
						const divCenterPos = holder.AbsolutePosition.add(
							holder.AbsoluteSize.div(2)
						);
						const currentPos = mousePos.getValue();
						cursorRelativeToDivCenter = currentPos.sub(divCenterPos);
					}
					zoomByMultiplier(
						props.PreviewEntry.Key,
						input.Position.Z * 1.3,
						cursorRelativeToDivCenter
					);
				} else {
					// Panning with scroll feels more of a hassle than useful for a storybook explorer, so I commented it out.
					// Maybe it can be an option in the future. I also forgot that actual scrolling elements exist
					// updateMountData(props.PreviewEntry.Key, (old) =>
					// 	Immut.produce(old, (draft) => {
					// 		draft.Offset = old.Offset.add(
					// 			shiftClicked
					// 				? new Vector2(input.Position.Z * 120, 0)
					// 				: new Vector2(0, input.Position.Z * 120)
					// 		);
					// 	})
					// );
				}
			}
		},
		[ctrlClicked]
	);
	const OnInputBegan = useCallback((_: Frame, input: InputObject) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton3) {
			setMiddleClicked(true);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setLeftClicked(true);
		}
	}, []);
	useEventListener(inputEnded, (input) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton3) {
			setMiddleClicked(false);
		} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setLeftClicked(false);
		} else if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftClicked(false);
		} else if (input.KeyCode === Enum.KeyCode.LeftControl) {
			setCtrlClicked(false);
		}
	});
	useEventListener(inputBegan, (input) => {
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			setShiftClicked(true);
		} else if (input.KeyCode === Enum.KeyCode.LeftControl) {
			setCtrlClicked(true);
		}
	});

	useEffect(() => {
		if (!inside) setMiddleClicked(false);
		const ctrlDrag = ctrlClicked && leftClicked;
		if (!inside || !(middleClicked || ctrlDrag)) {
			return setMouseDragging(false);
		}
		setMouseDragging(true);
	}, [middleClicked, ctrlClicked, leftClicked]);
	useEffect(() => {
		if (!mouseDragging) return;

		let previousPos = mousePos.getValue();
		const connection = RunService.PreRender.Connect(() => {
			const currentPos = mousePos.getValue();
			const delta = currentPos.sub(previousPos);
			previousPos = currentPos;

			updateMountData(props.PreviewEntry.Key, (old) =>
				Immut.produce(old, (draft) => {
					draft.Offset = old.Offset.add(delta);
				})
			);
		});

		return () => connection.Disconnect();
	}, [mouseDragging, props.PreviewEntry]);

	return (
		<Div
			Event={{
				InputBegan: OnInputBegan,
				InputChanged: OnInputChanged,
				MouseEnter: insideApi.enable,
				MouseLeave: insideApi.disable
			}}
		></Div>
	);
}

export default CanvasControls;
