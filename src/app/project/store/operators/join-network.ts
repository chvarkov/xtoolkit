import { filter, map, switchMap, take } from 'rxjs/operators';
import { ProjectSelector } from '../project.selector';
import { NetworkSelector } from '../../../network/store/network.selector';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { OperatorFunction } from 'rxjs';
import { Project } from '../../../core/data-provider/data-provider';
import { INetworkEnvironment } from '../../../core/elrond/interfaces/network-environment';

export type ActionProjectIdAware = TypedAction<string> & { projectId: string };
export type JoinedNetworkValue<A> = [A, Project, INetworkEnvironment];

export function joinNetwork<A extends ActionProjectIdAware>(store: Store): OperatorFunction<A, JoinedNetworkValue<A>> {
	return source => source.pipe(
		switchMap((action: A) => store.select(ProjectSelector.projectById(action.projectId)).pipe(
			take(1),
			filter(v => !!v),
			switchMap((project) => store.select(NetworkSelector.networkByChainId(project?.chainId || '')).pipe(
				map((network) => {
					return [action, project as Project, network as INetworkEnvironment] as JoinedNetworkValue<A>;
				}),
			)),
		)),
	);
}
