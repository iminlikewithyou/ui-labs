import React, { useEffect, useRef } from "@rbxts/react";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";
import { FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";
import { MounterProps } from ".";

const FUNCTIONAL_ERR = WARNING_STORY_TYPES.Functional;

function Functional(props: MounterProps<"Functional">) {
	const unmounter = useRef<() => void>();
	const mounted = useRef(false);

	useEffect(() => {
		//a reload can destroy the environment between this mounter rendering and
		//this effect running, the unmount signal already fired, so mounting now
		//would create a story nothing ever unmounts
		if (props.Environment.IsDestroyed()) return;
		mounted.current = true;
		unmounter.current = YCall(
			props.Result,
			props.MountFrame,
			(didYield, err) => {
				if (didYield) {
					UILabsWarn(WARNINGS.Yielding.format(FUNCTIONAL_ERR));
				} else {
					UILabsWarn(WARNINGS.StoryError.format(FUNCTIONAL_ERR), err);
				}
			}
		);
	}, []);

	props.UnmountSignal.Connect(() => {
		if (unmounter.current) {
			const cleanup = unmounter.current;
			FastSpawn(() => {
				const [success, err] = pcall(cleanup);
				if (!success) {
					UILabsWarn(WARNINGS.CleanupError, err);
				}
			});
		} else if (mounted.current) {
			//only warn when the story actually ran without returning a cleanup;
			//when the environment died before the mount effect ran, nothing was
			//mounted on purpose and there is rightfully nothing to clean up
			UILabsWarn(WARNINGS.NoCleanup);
		}
	});

	return <React.Fragment></React.Fragment>;
}

export default Functional;
