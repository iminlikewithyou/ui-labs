import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";
import { InferVideControls, InferVideProps } from "@rbxts/ui-labs";
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
import { CreateVideScopes, UpdateVideScopes } from "./Utils";

const VIDE_ERR = WARNING_STORY_TYPES.Vide;

function VideLib(props: MounterProps<"VideLib">) {
	const result = props.Result;
	const vide = result.vide;

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useParametrizedControls(
		props.Entry.Key,
		controls,
		props.RecoverControlsData,
		props.SetRecoverControlsData
	);
	const GetProps = useStoryPassedProps(props);

	const [sources, sourcesCleanup] = useMemo(() => {
		//the environment died before this mounter rendered (a reload landed while
		//it was being scheduled), the unmount signal already fired, so mounting
		//now would create a story nothing ever unmounts
		if (props.Environment.IsDestroyed()) {
			return [undefined, undefined] as const;
		}
		let gotSources: InferVideControls<ConvertedControls> = {};
		const cleanup = vide.mount(() => {
			gotSources = CreateVideScopes(vide, controls, controlValues);
		});
		return [gotSources, cleanup] as const;
	}, []);

	useUpdateEffect(() => {
		if (sources === undefined) return;
		UpdateVideScopes(sources, controls, controlValues);
	}, [controlValues]);

	const cleanup = useMemo(() => {
		if (sources === undefined) return undefined;
		const videProps: InferVideProps<ConvertedControls> = GetProps({
			controls: sources
		});
		const unmount = vide.mount(() => {
			return YCall(result.story, videProps, (didYield, err) => {
				if (didYield) {
					UILabsWarn(WARNINGS.Yielding.format(VIDE_ERR));
				} else {
					UILabsWarn(WARNINGS.StoryError.format(VIDE_ERR), err);
				}
			});
		}, props.MountFrame);
		return unmount;
	}, []);

	useStoryUnmount(result, props.UnmountSignal, () => {
		//cleanup is only undefined when the mount was skipped, and then the
		//unmount signal never reaches this handler, this is just for type safety
		if (cleanup === undefined || sourcesCleanup === undefined) return;
		vide.step(0); // disconnect spring connection;
		FastSpawn(() => {
			const [success, err] = pcall(cleanup);
			if (!success) {
				UILabsWarn(WARNINGS.CleanupError, err);
			}
		});
		sourcesCleanup();
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

export default VideLib;
