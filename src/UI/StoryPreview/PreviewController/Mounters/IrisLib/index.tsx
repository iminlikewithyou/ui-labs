import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";
import { InferIrisProps } from "@rbxts/ui-labs";
import {
	ConvertedControls,
	ReturnControls
} from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { WARNING_STORY_TYPES, WARNINGS } from "Plugin/Warnings";
import { FastSpawn, UILabsWarn, YCall } from "Utils/MiscUtils";
import { MounterProps } from "..";
import { useStoryUnmount } from "../../Utils";
import {
	useControls,
	useParametrizedControls,
	useStoryActionComponents,
	useStoryPassedProps
} from "../Hooks";
import {
	CreateIrisStates,
	SetupIris,
	UpdateIrisStates,
	useUserInputServiceMock
} from "./Utils";

const IRIS_ERR = WARNING_STORY_TYPES.Iris;

function IrisLib(props: MounterProps<"IrisLib">) {
	const result = props.Result;
	const uisMock = useUserInputServiceMock(props.ListenerFrame);

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData
	);
	const GetProps = useStoryPassedProps(props);

	const [irisStates, SetupCleanup, StoryCleanup] = useMemo(() => {
		//the environment died before this mounter rendered (a reload landed while
		//it was being scheduled), the unmount signal already fired, so mounting
		//now would create a story nothing ever unmounts
		if (props.Environment.IsDestroyed()) {
			return [undefined, undefined, undefined] as const;
		}
		const setupCleanup = SetupIris(result.iris, props.MountFrame, uisMock);
		result.iris.Init(props.MountFrame);

		const states = CreateIrisStates(result.iris, controls, controlValues);
		const irisProps: InferIrisProps<ConvertedControls> = GetProps({
			controls: states
		});

		const cleanup = YCall(result.story, irisProps, (didYield, err) => {
			if (didYield) {
				UILabsWarn(WARNINGS.Yielding.format(IRIS_ERR));
			} else {
				UILabsWarn(WARNINGS.StoryError.format(IRIS_ERR), err);
			}
		});
		return [states, setupCleanup, cleanup] as const;
	}, []);

	useUpdateEffect(() => {
		if (irisStates === undefined) return;
		UpdateIrisStates(irisStates, controls, controlValues);
	}, [controlValues]);

	useStoryUnmount(result, props.UnmountSignal, () => {
		//SetupCleanup is only undefined when the mount was skipped, and then the
		//unmount signal never reaches this handler, this is just for type safety
		if (SetupCleanup === undefined) return;
		if (StoryCleanup) {
			FastSpawn(() => {
				const [success, err] = pcall(StoryCleanup);
				if (!success) {
					UILabsWarn(WARNINGS.CleanupError, err);
				}
			});
		}
		SetupCleanup();

		props.Result.iris.Shutdown();
		uisMock.Destroy();
	});

	useStoryActionComponents(
		props.Entry.Key,
		props.Result,
		returnControls,
		controls,
		controlValues,
		setControlValues
	);

	return <></>;
}

export default IrisLib;
