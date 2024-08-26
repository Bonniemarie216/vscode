/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import TelemetryReporter, { TelemetryEventProperties } from '@vscode/extension-telemetry';
import { IExperimentationTelemetry } from 'vscode-tas-client';

export const enum MicrosoftAccountType {
	AAD = 'aad',
	MSA = 'msa',
	Unknown = 'unknown'
}

export class MicrosoftAuthenticationTelemetryReporter implements IExperimentationTelemetry {
	private sharedProperties: Record<string, string> = {};
	protected _telemetryReporter: TelemetryReporter;
	constructor(aiKey: string) {
		this._telemetryReporter = new TelemetryReporter(aiKey);
	}

	get telemetryReporter(): TelemetryReporter {
		return this._telemetryReporter;
	}

	setSharedProperty(name: string, value: string): void {
		this.sharedProperties[name] = value;
	}

	postEvent(eventName: string, props: Map<string, string>): void {
		const eventProperties: TelemetryEventProperties = { ...this.sharedProperties, ...Object.fromEntries(props) };
		this._telemetryReporter.sendTelemetryEvent(
			eventName,
			eventProperties
		);
	}

	sendLoginEvent(scopes: readonly string[]): void {
		/* __GDPR__
			"login" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine the usage of the Microsoft Auth Provider.",
				"scopes": { "classification": "OrgIdentifiableInformation", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." }
			}
		*/
		this._telemetryReporter.sendTelemetryEvent('login', {
			// Get rid of guids from telemetry.
			scopes: JSON.stringify(scopes),
		});
	}
	sendLoginFailedEvent(): void {
		/* __GDPR__
			"loginFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users run into issues with the login flow." }
		*/
		this._telemetryReporter.sendTelemetryEvent('loginFailed');
	}
	sendLogoutEvent(): void {
		/* __GDPR__
			"logout" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logout');
	}
	sendLogoutFailedEvent(): void {
		/* __GDPR__
			"logoutFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often fail to log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logoutFailed');
	}
	/**
	 * Sends an event for an account type available at startup.
	 * @param scopes The scopes for the session
	 * @param accountType The account type for the session
	 * @todo Remove the scopes since we really don't care about them.
	 */
	sendAccountEvent(scopes: string[], accountType: MicrosoftAccountType): void {
		/* __GDPR__
			"login" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine the usage of the Microsoft Auth Provider.",
				"scopes": { "classification": "OrgIdentifiableInformation", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." },
				"accountType": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight", "comment": "Used to determine what account types are being used." }
			}
		*/
		this._telemetryReporter.sendTelemetryEvent('account', {
			// Get rid of guids from telemetry.
			scopes: JSON.stringify(scopes),
			accountType
		});
	}
}

export class MicrosoftSovereignCloudAuthenticationTelemetryReporter extends MicrosoftAuthenticationTelemetryReporter {
	override sendLoginEvent(scopes: string[]): void {
		/* __GDPR__
			"loginMicrosoftSovereignCloud" : {
				"owner": "TylerLeonhardt",
				"comment": "Used to determine the usage of the Microsoft Auth Provider.",
				"scopes": { "classification": "OrgIdentifiableInformation", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." }
			}
		*/
		this._telemetryReporter.sendTelemetryEvent('loginMicrosoftSovereignCloud', {
			// Get rid of guids from telemetry.
			scopes: JSON.stringify(scopes),
		});
	}
	override sendLoginFailedEvent(): void {
		/* __GDPR__
			"loginMicrosoftSovereignCloudFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users run into issues with the login flow." }
		*/
		this._telemetryReporter.sendTelemetryEvent('loginMicrosoftSovereignCloudFailed');
	}
	override sendLogoutEvent(): void {
		/* __GDPR__
			"logoutMicrosoftSovereignCloud" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logoutMicrosoftSovereignCloud');
	}
	override sendLogoutFailedEvent(): void {
		/* __GDPR__
			"logoutMicrosoftSovereignCloudFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often fail to log out." }
		*/
		this._telemetryReporter.sendTelemetryEvent('logoutMicrosoftSovereignCloudFailed');
	}
}
