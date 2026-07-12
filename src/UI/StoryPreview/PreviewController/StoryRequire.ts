import { Janitor } from "@rbxts/janitor";
import { useAsync, useLatest } from "@rbxts/pretty-react-hooks";
import { useCallback, useEffect, useState } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import {
	useGetInputSignalsFromFrame,
	useInputSignals
} from "Context/UserInputContext";
import { usePlugin } from "Hooks/Reflex/Use/Plugin";
import Configs from "Plugin/Configs";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { selectPluginWidget } from "Reflex/Plugin";
import { Environment } from "Utils/HotReloader/Environment";
import { HotReloader } from "Utils/HotReloader/HotReloader";
import { CreateTuple } from "Utils/MiscUtils";
import { CreateEntrySnapshot, ReloadEntry } from "../Utils";

/** A require result paired with the environment that produced it, so consumers can
 *  never mix a stale result with a newer reload's environment. */
export interface RequiredStory {
	Result: unknown;
	Environment: Environment;
}

interface PendingRequire {
	Promise: Promise<unknown>;
	Environment: Environment;
}

export function useStoryRequire(
	entry: PreviewEntry,
	studioMode: boolean,
	canReload: boolean
) {
	const plugin = usePlugin();
	const node = useSelector(selectNodeFromModule(entry.Module));
	const [reloader, setReloader] = useState<HotReloader>();
	const [reloadQuery, setReloadQuery] = useState(false);
	const [resultPromise, setResultPromise] = useState<PendingRequire>();
	const { unmountByUID, updateMountData } = useProducer<RootProducer>();
	const widget = useSelector(selectPluginWidget);
	const inputs = useGetInputSignalsFromFrame(entry.ListenerFrame);
	const inputSignals = useInputSignals(inputs);

	const latestInput = useLatest(inputSignals);
	const latestEntry = useLatest(entry);
	const InjectGlobalControls = useCallback(
		(environment: Environment) => {
			const pluginInjection: Record<string, unknown> = {};
			const janitor = new Janitor();
			const runtimeListeners: Array<() => void> = [];

			pluginInjection["Unmount"] = () => {
				unmountByUID(latestEntry.current.UID);
			};
			pluginInjection["Reload"] = () => {
				ReloadEntry(latestEntry.current);
			};
			pluginInjection["__RunOnRuntimeListeners__"] = () => {
				runtimeListeners.forEach((listener) => {
					listener();
				});
			};
			pluginInjection["OnRuntimeStart"] = (listener: () => void) => {
				if (pluginInjection["Runtime"] === undefined) {
					runtimeListeners.push(listener);
				} else {
					listener();
				}
			};
			pluginInjection["SetStoryHolder"] = (holder?: Instance) => {
				updateMountData(latestEntry.current.UID, (oldData) => {
					return {
						...oldData,
						OverrideHolder: holder
					};
				});
			};
			pluginInjection["CreateSnapshot"] = (name?: string) => {
				CreateEntrySnapshot(latestEntry.current, name);
			};
			pluginInjection["InputListener"] = latestInput.current;
			pluginInjection["StoryJanitor"] = janitor;
			pluginInjection["PreviewUID"] = latestEntry.current.UID;
			pluginInjection["OriginalG"] = _G;
			pluginInjection["PluginWidget"] = widget;
			pluginInjection["EnvironmentUID"] = environment.EnvironmentUID;
			pluginInjection["Plugin"] = plugin;

			environment.InjectGlobal(Configs.GlobalInjectionKey, pluginInjection);

			return () => {
				janitor.Destroy();
			};
		},
		[entry.UID, widget]
	);

	//Creating the hot reloader
	useEffect(() => {
		if (!node) return;

		const reloader = new HotReloader(node.Module);
		reloader.HookOnReload((environment) => {
			const cleanup = InjectGlobalControls(environment);
			environment.HookOnDestroyed(() => {
				cleanup();
			}, 2);
		}, 2);

		const promise = reloader.Reload();
		const environment = reloader.GetEnvironment();
		if (environment) {
			setResultPromise({ Promise: promise, Environment: environment });
		}
		setReloader(reloader);

		return () => {
			reloader.Destroy();
		};
	}, [entry.UID]);

	//Listen for hot reloader updates
	useEffect(() => {
		if (!node) return;
		if (!reloader) return;
		reloader.AutoReload = !studioMode && entry.AutoReload;

		const changed = reloader.OnReloadStarted.Connect((promise) => {
			//OnReloadStarted fires synchronously inside Reload, so the reloader's
			//current environment is the one this promise belongs to
			const environment = reloader.GetEnvironment();
			if (environment) {
				setResultPromise({ Promise: promise, Environment: environment });
			}
		});
		if (studioMode && entry.AutoReload) {
			const onReloadQuery = reloader.OnDependencyChanged.Connect(() => {
				setReloadQuery(true);
			});
			return () => {
				onReloadQuery.Disconnect();
				changed.Disconnect();
			};
		} else {
			setReloadQuery(false);
		}
		return () => changed.Disconnect();
	}, [reloader, studioMode, entry.AutoReload]);

	// Flushing queried reloads (studio mode)
	useEffect(() => {
		if (!reloader) return;
		if (!reloadQuery) return;
		if (!canReload) return;
		if (!studioMode) return;

		reloader.ScheduleReload();
		setReloadQuery(false);
	}, [reloader, reloadQuery, canReload, studioMode]);

	//Resolving promises
	const [required] = useAsync<RequiredStory | undefined>(() => {
		if (!resultPromise) return Promise.resolve(undefined);

		return resultPromise.Promise.andThen(
			(result) =>
				({
					Result: result,
					Environment: resultPromise.Environment
				}) as RequiredStory | undefined
		).catch((err) => {
			if (Promise.Error.is(err)) {
				warn("Story errored while required: \n\n" + err.trace);
			} else {
				warn("Story errored while required: \n\n" + tostring(err));
			}
			return undefined;
		});
	}, [resultPromise]);

	return CreateTuple(required, reloader);
}
