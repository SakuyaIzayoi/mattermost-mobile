// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {BehaviorSubject} from 'rxjs';

import {toMilliseconds} from '@utils/datetime';

const TIME_TO_CLEAR_WEBSOCKET_ACTIONS = toMilliseconds({seconds: 30});

class EphemeralStore {
    theme: Theme | undefined;
    creatingChannel = false;
    creatingDMorGMTeammates: string[] = [];

    private pushProxyVerification: {[serverUrl: string]: string | undefined} = {};
    private canJoinOtherTeams: {[serverUrl: string]: BehaviorSubject<boolean>} = {};

    private websocketEditingPost: {[serverUrl: string]: {[id: string]: {post: Post; timeout: NodeJS.Timeout} | undefined} | undefined} = {};
    private websocketRemovingPost: {[serverUrl: string]: Set<string> | undefined} = {};

    // As of today, the server sends a duplicated event to add the user to the team.
    // If we do not handle this, this ends up showing some errors in the database, apart
    // of the extra computation time. We use this to track the events that are being handled
    // and make sure we only handle one.
    private addingTeam = new Set<string>();
    private joiningChannels = new Set<string>();
    private leavingChannels = new Set<string>();
    private archivingChannels = new Set<string>();
    private convertingChannels = new Set<string>();
    private switchingToChannel = new Set<string>();
    private currentThreadId = '';
    private notificationTapped = false;
    private enablingCRT = false;

    // Ephemeral control for out of order websocket events
    addEditingPost = (serverUrl: string, post: Post) => {
        if (this.websocketRemovingPost[serverUrl]?.has(post.id)) {
            return;
        }

        const lastEdit = this.websocketEditingPost[serverUrl]?.[post.id];
        if (lastEdit && post.edit_at < lastEdit.post.update_at) {
            return;
        }

        if (!this.websocketEditingPost[serverUrl]) {
            this.websocketEditingPost[serverUrl] = {};
        }
        const serverEditing = this.websocketEditingPost[serverUrl]!;

        if (lastEdit?.timeout) {
            clearTimeout(lastEdit.timeout);
        }

        const timeout = setTimeout(() => {
            delete serverEditing[post.id];
        }, TIME_TO_CLEAR_WEBSOCKET_ACTIONS);

        serverEditing[post.id] = {post, timeout};
    };

    addRemovingPost = (serverUrl: string, postId: string) => {
        if (this.websocketRemovingPost[serverUrl]?.has(postId)) {
            return;
        }

        if (this.websocketEditingPost[serverUrl]?.[postId]) {
            clearTimeout(this.websocketEditingPost[serverUrl]![postId]!.timeout);
            delete this.websocketEditingPost[serverUrl]![postId];
        }

        if (!this.websocketRemovingPost[serverUrl]) {
            this.websocketRemovingPost[serverUrl] = new Set();
        }

        setTimeout(() => {
            this.websocketRemovingPost[serverUrl]?.delete(postId);
        }, TIME_TO_CLEAR_WEBSOCKET_ACTIONS);

        this.websocketRemovingPost[serverUrl]?.add(postId);
    };

    getLastPostWebsocketEvent = (serverUrl: string, postId: string) => {
        if (this.websocketRemovingPost[serverUrl]?.has(postId)) {
            return {deleted: true, post: undefined};
        }

        if (this.websocketEditingPost[serverUrl]?.[postId]) {
            return {deleted: false, post: this.websocketEditingPost[serverUrl]![postId]!.post};
        }

        return undefined;
    };

    // Ephemeral control when (un)archiving a channel locally
    addArchivingChannel = (channelId: string) => {
        this.archivingChannels.add(channelId);
    };

    isArchivingChannel = (channelId: string) => {
        return this.archivingChannels.has(channelId);
    };

    removeArchivingChannel = (channelId: string) => {
        this.archivingChannels.delete(channelId);
    };

    // Ephemeral control when converting a channel to private locally
    addConvertingChannel = (channelId: string) => {
        this.convertingChannels.add(channelId);
    };

    isConvertingChannel = (channelId: string) => {
        return this.convertingChannels.has(channelId);
    };

    removeConvertingChannel = (channelId: string) => {
        this.convertingChannels.delete(channelId);
    };

    // Ephemeral control when leaving a channel locally
    addLeavingChannel = (channelId: string) => {
        this.leavingChannels.add(channelId);
    };

    isLeavingChannel = (channelId: string) => {
        return this.leavingChannels.has(channelId);
    };

    removeLeavingChannel = (channelId: string) => {
        this.leavingChannels.delete(channelId);
    };

    // Ephemeral control when joining a channel locally
    addJoiningChannel = (channelId: string) => {
        this.joiningChannels.add(channelId);
    };

    isJoiningChannel = (channelId: string) => {
        return this.joiningChannels.has(channelId);
    };

    removeJoiningChannel = (channelId: string) => {
        this.joiningChannels.delete(channelId);
    };

    // Ephemeral control when adding a team locally
    startAddingToTeam = (teamId: string) => {
        this.addingTeam.add(teamId);
    };

    finishAddingToTeam = (teamId: string) => {
        this.addingTeam.delete(teamId);
    };

    isAddingToTeam = (teamId: string) => {
        return this.addingTeam.has(teamId);
    };

    // Ephemeral for push proxy state
    setPushProxyVerificationState = (serverUrl: string, state: string) => {
        this.pushProxyVerification[serverUrl] = state;
    };

    getPushProxyVerificationState = (serverUrl: string) => {
        return this.pushProxyVerification[serverUrl];
    };

    // Ephemeral for the last viewed thread
    getCurrentThreadId = () => {
        return this.currentThreadId;
    };

    setCurrentThreadId = (id: string) => {
        this.currentThreadId = id;
    };

    // Ephemeral control when (un)archiving a channel locally
    addSwitchingToChannel = (channelId: string) => {
        this.switchingToChannel.add(channelId);
    };

    isSwitchingToChannel = (channelId: string) => {
        return this.switchingToChannel.has(channelId);
    };

    removeSwitchingToChannel = (channelId: string) => {
        this.switchingToChannel.delete(channelId);
    };

    setEnablingCRT = (value: boolean) => {
        this.enablingCRT = value;
    };

    isEnablingCRT = () => {
        return this.enablingCRT;
    };

    private getCanJoinOtherTeamsSubject = (serverUrl: string) => {
        if (!this.canJoinOtherTeams[serverUrl]) {
            this.canJoinOtherTeams[serverUrl] = new BehaviorSubject(false);
        }

        return this.canJoinOtherTeams[serverUrl];
    };

    observeCanJoinOtherTeams = (serverUrl: string) => {
        return this.getCanJoinOtherTeamsSubject(serverUrl).asObservable();
    };

    setCanJoinOtherTeams = (serverUrl: string, value: boolean) => {
        this.getCanJoinOtherTeamsSubject(serverUrl).next(value);
    };

    setNotificationTapped = (value: boolean) => {
        this.notificationTapped = value;
    };

    wasNotificationTapped = () => {
        return this.notificationTapped;
    };
}

export default new EphemeralStore();
