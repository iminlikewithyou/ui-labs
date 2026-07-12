import { Signal } from "@rbxts/lemon-signal";
import React from "@rbxts/react";
import { Environment } from "Utils/HotReloader/Environment";
import { RecoverControlsData } from ".";
import MountingMap, { Mounter } from "./Mounters";

export function MountStory<T extends MountType>(
	mountType: T,
	entry: PreviewEntry,
	result: MountResults[T],
	frame: Frame,
	listener: Frame,
	environment: Environment,
	unmountSignal: Signal,
	recoverControlsData: RecoverControlsData | undefined,
	setRecoverControlsData: (data?: RecoverControlsData) => void
) {
	const Mounter = MountingMap[mountType] as Mounter<T>;
	const renderer = (
		<Mounter
			Result={result}
			MountFrame={frame}
			ListenerFrame={listener}
			Entry={entry}
			Environment={environment}
			UnmountSignal={unmountSignal}
			RecoverControlsData={recoverControlsData}
			SetRecoverControlsData={setRecoverControlsData}
		/>
	);

	return renderer;
}
