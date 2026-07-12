import { Signal } from "@rbxts/lemon-signal";
import React from "@rbxts/react";
import { Environment } from "Utils/HotReloader/Environment";
import { RecoverControlsData } from "..";
import Functional from "./Functional";
import FusionLib from "./FusionLib";
import Generic from "./Generic";
import IrisLib from "./IrisLib";
import ReactLib from "./RoactReact/ReactLib";
import RoactLib from "./RoactReact/RoactLib";
import VideLib from "./VideLib";

export interface MounterProps<T extends MountType> {
	Entry: PreviewEntry;
	Result: MountResults[T];
	MountFrame: Frame;
	ListenerFrame: Frame;
	/** The hot-reload environment this story belongs to. A reload can destroy it
	 *  between this mounter being scheduled and its mount actually running, after
	 *  the unmount signal already fired, so mounters must not mount when it is
	 *  already destroyed. */
	Environment: Environment;
	UnmountSignal: Signal;
	RecoverControlsData?: RecoverControlsData;
	SetRecoverControlsData: (data?: RecoverControlsData) => void;
}

export type Mounter<T extends MountType> = React.FunctionComponent<
	MounterProps<T>
>;

const MountingMap: { [K in MountType]: Mounter<K> } = {
	Functional: Functional,
	RoactLib: RoactLib,
	ReactLib: ReactLib,
	FusionLib: FusionLib,
	IrisLib: IrisLib,
	VideLib: VideLib,
	Generic: Generic
};
export default MountingMap;
