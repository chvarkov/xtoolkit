import { createAction, props } from '@ngrx/store';
import { GeneratedWallet, Project } from '../../core/data-provider/data-provider';
import { ITokenPosition } from '../../core/elrond/interfaces/token-position';
import { ProjectComponentType } from '../../core/types';
import { TabsData } from '../../core/data-provider/personal-settings.manager';
import { AbiJson } from '../../core/elrond/builders/sc.builder';
import { IElrondTransaction } from '../../core/elrond/interfaces/elrond-transaction';
import { AccountOnNetwork } from '@elrondnetwork/erdjs-network-providers/out';
import { ITokenInfo } from '../../core/elrond/interfaces/token-info';

export class ProjectAction {
	static readonly loadProjects = createAction(`[${ProjectAction.name}] load projects [...]`);
	static readonly loadProjectsSuccess = createAction(`[${ProjectAction.name}] load projects [OK]`, props<{data: Project[]}>());
	static readonly loadProjectsError = createAction(`[${ProjectAction.name}] load projects [ERR]`, props<{err: Error}>());

	static readonly createProject = createAction(`[${ProjectAction.name}] create project [...]`);
	static readonly createProjectSuccess = createAction(`[${ProjectAction.name}] create project [OK]`, props<{project: Project}>());
	static readonly createProjectError = createAction(`[${ProjectAction.name}] create project [ERR]`, props<{err: Error}>());

	static readonly addAbi = createAction(`[${ProjectAction.name}] add abi [...]`, props<{projectId: string, name?: string, abi: AbiJson}>());
	static readonly addAbiSuccess = createAction(`[${ProjectAction.name}] add abi [OK]`, props<{project: Project}>());
	static readonly addAbiError = createAction(`[${ProjectAction.name}] add abi [ERR]`, props<{err: Error}>());

	static readonly loadAccountAndPositions = createAction(`[${ProjectAction.name}] load account and positions [...]`, props<{projectId: string, address: string}>());
	static readonly loadAccountAndPositionsSuccess = createAction(`[${ProjectAction.name}] load account and positions [OK]`, props<{projectId: string, native: string, account: AccountOnNetwork, tokens: ITokenPosition[]}>());
	static readonly loadAccountAndPositionsError = createAction(`[${ProjectAction.name}] load account and positions [ERR]`, props<{err: Error}>());

	static readonly addWallet = createAction(`[${ProjectAction.name}] add wallet [...]`, props<{projectId: string, wallet: GeneratedWallet}>());
	static readonly addWalletSuccess = createAction(`[${ProjectAction.name}] add wallet [OK]`, props<{project: Project, address: string}>());
	static readonly addWalletError = createAction(`[${ProjectAction.name}] add wallet [ERR]`, props<{err: Error}>());

	static readonly generateWallet = createAction(`[${ProjectAction.name}] generate wallet`, props<{projectId: string}>());

	static readonly uploadAbi = createAction(`[${ProjectAction.name}] upload abi`, props<{projectId: string}>());

	static readonly setScAddress = createAction(`[${ProjectAction.name}] set sc address [...]`, props<{projectId: string, scId: string, address: string}>());
	static readonly setScAddressSuccess = createAction(`[${ProjectAction.name}] set sc address [OK]`, props<{project: Project}>());
	static readonly setScAddressError = createAction(`[${ProjectAction.name}] set sc address [ERR]`, props<{err: Error}>());

	static readonly addToken = createAction(`[${ProjectAction.name}] add token [...]`, props<{projectId: string}>());
	static readonly addTokenSuccess = createAction(`[${ProjectAction.name}] add token [OK]`, props<{project: Project}>());
	static readonly addTokenError = createAction(`[${ProjectAction.name}] add token [ERR]`, props<{err: Error}>());

	static readonly loadProjectTabs = createAction(`[${ProjectAction.name}] load project tabs [...]`);
	static readonly loadProjectTabsSuccess = createAction(`[${ProjectAction.name}] load project tabs [OK]`, props<{tabsData: TabsData}>());
	static readonly loadProjectTabsError = createAction(`[${ProjectAction.name}] load project tabs [ERR]`, props<{err: Error}>());

	static readonly openProjectTab = createAction(
		`[${ProjectAction.name}] open project tab [...]`,
		props<{projectId: string, title: string, componentType: ProjectComponentType, componentId: string}>(),
	);
	static readonly openProjectTabSuccess = createAction(`[${ProjectAction.name}] open project tab [OK]`, props<{tabsData: TabsData}>());
	static readonly openProjectTabError = createAction(`[${ProjectAction.name}] open project tab [ERR]`, props<{err: Error}>());

	static readonly closeProjectTab = createAction(`[${ProjectAction.name}] close project tab [...]`, props<{index: number}>());
	static readonly closeProjectTabSuccess = createAction(`[${ProjectAction.name}] close project tab [OK]`, props<{tabsData: TabsData}>());
	static readonly closeProjectTabError = createAction(`[${ProjectAction.name}] close project tab [ERR]`, props<{err: Error}>());

	static readonly moveProjectTab = createAction(`[${ProjectAction.name}] move project tab [...]`, props<{prevIndex: number, currentIndex: number}>());
	static readonly moveProjectTabSuccess = createAction(`[${ProjectAction.name}] move project tab [OK]`, props<{tabsData: TabsData}>());
	static readonly moveProjectTabError = createAction(`[${ProjectAction.name}] move project tab [ERR]`, props<{err: Error}>());

	static readonly selectTab = createAction(`[${ProjectAction.name}] select tab [...]`, props<{index: number}>());
	static readonly selectTabSuccess = createAction(`[${ProjectAction.name}] select tab [OK]`, props<{tabsData: TabsData}>());
	static readonly selectTabError = createAction(`[${ProjectAction.name}] select tab [ERR]`, props<{err: Error}>());

	static readonly loadScCode = createAction(`[${ProjectAction.name}] load sc code [...]`, props<{address: string}>());
	static readonly loadScCodeSuccess = createAction(`[${ProjectAction.name}] load sc code [OK]`, props<{address: string, code: string}>());
	static readonly loadScCodeError = createAction(`[${ProjectAction.name}] load sc code [ERR]`, props<{err: Error}>());

	static readonly loadAccountTransactions = createAction(`[${ProjectAction.name}] load account transactions [...]`, props<{projectId: string, address: string}>());
	static readonly loadAccountTransactionsSuccess = createAction(`[${ProjectAction.name}] load account transactions [OK]`, props<{projectId: string, address: string, list: IElrondTransaction[]}>());
	static readonly loadAccountTransactionsError = createAction(`[${ProjectAction.name}] load account transactions [ERR]`, props<{err: Error}>());

	static readonly loadToken = createAction(`[${ProjectAction.name}] load token [...]`, props<{projectId: string, identifier: string}>());
	static readonly loadTokenSuccess = createAction(`[${ProjectAction.name}] load token [OK]`, props<{projectId: string, identifier: string, data: ITokenInfo}>());
	static readonly loadTokenError = createAction(`[${ProjectAction.name}] load token [ERR]`, props<{err: Error}>());

}

