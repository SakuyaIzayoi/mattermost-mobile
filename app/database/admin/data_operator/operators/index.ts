// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import Model from '@nozbe/watermelondb/Model';

import {MM_TABLES} from '@constants/database';
import App from '@typings/database/app';
import Channel from '@typings/database/channel';
import ChannelInfo from '@typings/database/channel_info';
import ChannelMembership from '@typings/database/channel_membership';
import CustomEmoji from '@typings/database/custom_emoji';
import {
    DataFactoryArgs,
    RawApp,
    RawChannel,
    RawChannelInfo,
    RawChannelMembership,
    RawCustomEmoji,
    RawDraft,
    RawFile,
    RawGlobal,
    RawGroup,
    RawGroupMembership,
    RawGroupsInChannel,
    RawGroupsInTeam,
    RawMyChannel,
    RawMyChannelSettings,
    RawMyTeam,
    RawPost,
    RawPostMetadata,
    RawPostsInChannel,
    RawPostsInThread,
    RawPreference,
    RawReaction,
    RawRole,
    RawServers,
    RawSlashCommand,
    RawSystem,
    RawTeam,
    RawTeamChannelHistory,
    RawTeamMembership,
    RawTeamSearchHistory,
    RawTermsOfService,
    RawUser,
} from '@typings/database/database';
import Draft from '@typings/database/draft';
import {OperationType} from '@typings/database/enums';
import File from '@typings/database/file';
import Global from '@typings/database/global';
import Group from '@typings/database/group';
import GroupMembership from '@typings/database/group_membership';
import GroupsInChannel from '@typings/database/groups_in_channel';
import GroupsInTeam from '@typings/database/groups_in_team';
import MyChannel from '@typings/database/my_channel';
import MyChannelSettings from '@typings/database/my_channel_settings';
import MyTeam from '@typings/database/my_team';
import Post from '@typings/database/post';
import PostMetadata from '@typings/database/post_metadata';
import PostsInChannel from '@typings/database/posts_in_channel';
import PostsInThread from '@typings/database/posts_in_thread';
import Preference from '@typings/database/preference';
import Reaction from '@typings/database/reaction';
import Role from '@typings/database/role';
import Servers from '@typings/database/servers';
import SlashCommand from '@typings/database/slash_command';
import System from '@typings/database/system';
import Team from '@typings/database/team';
import TeamChannelHistory from '@typings/database/team_channel_history';
import TeamMembership from '@typings/database/team_membership';
import TeamSearchHistory from '@typings/database/team_search_history';
import TermsOfService from '@typings/database/terms_of_service';
import User from '@typings/database/user';

const {APP, GLOBAL, SERVERS} = MM_TABLES.DEFAULT;
const {
    CHANNEL,
    CHANNEL_INFO,
    CHANNEL_MEMBERSHIP,
    CUSTOM_EMOJI,
    DRAFT,
    FILE,
    GROUP,
    GROUPS_IN_CHANNEL,
    GROUPS_IN_TEAM,
    GROUP_MEMBERSHIP,
    MY_CHANNEL,
    MY_CHANNEL_SETTINGS,
    MY_TEAM,
    POST,
    POSTS_IN_CHANNEL,
    POSTS_IN_THREAD,
    POST_METADATA,
    PREFERENCE,
    REACTION,
    ROLE,
    SLASH_COMMAND,
    SYSTEM,
    TEAM,
    TEAM_CHANNEL_HISTORY,
    TEAM_MEMBERSHIP,
    TEAM_SEARCH_HISTORY,
    TERMS_OF_SERVICE,
    USER,
} = MM_TABLES.SERVER;

/**
 * operateAppRecord: Prepares record of entity 'App' from the DEFAULT database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateAppRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawApp;
    const record = value.record as App;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (app: App) => {
        app._raw.id = isCreateAction ? app.id : record.id;
        app.buildNumber = raw?.build_number;
        app.createdAt = raw?.created_at;
        app.versionNumber = raw?.version_number;
    };

    return operateBaseRecord({
        action,
        database,
        generator,
        tableName: APP,
        value,
    });
};

/**
 * operateGlobalRecord: Prepares record of entity 'Global' from the DEFAULT database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateGlobalRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawGlobal;
    const record = value.record as Global;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (global: Global) => {
        global._raw.id = isCreateAction ? global.id : record.id;
        global.name = raw?.name;
        global.value = raw?.value;
    };

    return operateBaseRecord({
        action,
        database,
        generator,
        tableName: GLOBAL,
        value,
    });
};

/**
 * operateServersRecord: Prepares record of entity 'Servers' from the DEFAULT database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateServersRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawServers;
    const record = value.record as Servers;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (servers: Servers) => {
        servers._raw.id = isCreateAction ? servers.id : record.id;
        servers.dbPath = raw?.db_path;
        servers.displayName = raw?.display_name;
        servers.mentionCount = raw?.mention_count;
        servers.unreadCount = raw?.unread_count;
        servers.url = raw?.url;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: SERVERS,
        value,
        generator,
    });
};

/**
 * operateCustomEmojiRecord: Prepares record of entity 'CustomEmoji' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateCustomEmojiRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawCustomEmoji;
    const record = value.record as CustomEmoji;
    const isCreateAction = action === OperationType.CREATE;

    // id of emoji comes from server response
    const generator = (emoji: CustomEmoji) => {
        emoji._raw.id = isCreateAction ? (raw?.id ?? emoji.id) : record.id;
        emoji.name = raw.name;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: CUSTOM_EMOJI,
        value,
        generator,
    });
};

/**
 * operateRoleRecord: Prepares record of entity 'Role' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateRoleRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawRole;
    const record = value.record as Role;
    const isCreateAction = action === OperationType.CREATE;

    // id of role comes from server response
    const generator = (role: Role) => {
        role._raw.id = isCreateAction ? (raw?.id ?? role.id) : record.id;
        role.name = raw?.name;
        role.permissions = raw?.permissions;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: ROLE,
        value,
        generator,
    });
};

/**
 * operateSystemRecord: Prepares record of entity 'System' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateSystemRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawSystem;
    const record = value.record as System;
    const isCreateAction = action === OperationType.CREATE;

    // id of system comes from server response
    const generator = (system: System) => {
        system._raw.id = isCreateAction ? (raw?.id ?? system.id) : record?.id;
        system.name = raw?.name;
        system.value = raw?.value;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: SYSTEM,
        value,
        generator,
    });
};

/**
 * operateTermsOfServiceRecord: Prepares record of entity 'TermsOfService' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateTermsOfServiceRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawTermsOfService;
    const record = value.record as TermsOfService;
    const isCreateAction = action === OperationType.CREATE;

    // id of TOS comes from server response
    const generator = (tos: TermsOfService) => {
        tos._raw.id = isCreateAction ? (raw?.id ?? tos.id) : record?.id;
        tos.acceptedAt = raw?.accepted_at;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: TERMS_OF_SERVICE,
        value,
        generator,
    });
};

/**
 * operatePostRecord: Prepares record of entity 'Post' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operatePostRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawPost;
    const record = value.record as Post;
    const isCreateAction = action === OperationType.CREATE;

    // id of post comes from server response
    const generator = (post: Post) => {
        post._raw.id = isCreateAction ? (raw?.id ?? post.id) : record?.id;
        post.channelId = raw?.channel_id;
        post.createAt = raw?.create_at;
        post.deleteAt = raw?.delete_at || raw?.delete_at === 0 ? raw?.delete_at : 0;
        post.editAt = raw?.edit_at;
        post.updateAt = raw?.update_at;
        post.isPinned = raw!.is_pinned!;
        post.message = Q.sanitizeLikeString(raw?.message);
        post.userId = raw?.user_id;
        post.originalId = raw?.original_id ?? '';
        post.pendingPostId = raw?.pending_post_id ?? '';
        post.previousPostId = raw?.prev_post_id ?? '';
        post.rootId = raw?.root_id ?? '';
        post.type = raw?.type ?? '';
        post.props = raw?.props ?? {};
    };

    return operateBaseRecord({
        action,
        database,
        tableName: POST,
        value,
        generator,
    });
};

/**
 * operatePostInThreadRecord: Prepares record of entity 'POSTS_IN_THREAD' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operatePostInThreadRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawPostsInThread;
    const record = value.record as PostsInThread;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (postsInThread: PostsInThread) => {
        postsInThread.postId = isCreateAction ? raw.post_id : record.id;
        postsInThread.earliest = raw.earliest;
        postsInThread.latest = raw.latest!;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: POSTS_IN_THREAD,
        value,
        generator,
    });
};

/**
 * operateReactionRecord: Prepares record of entity 'REACTION' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateReactionRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawReaction;
    const record = value.record as Reaction;
    const isCreateAction = action === OperationType.CREATE;

    // id of reaction comes from server response
    const generator = (reaction: Reaction) => {
        reaction._raw.id = isCreateAction ? reaction.id : record?.id;
        reaction.userId = raw.user_id;
        reaction.postId = raw.post_id;
        reaction.emojiName = raw.emoji_name;
        reaction.createAt = raw.create_at;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: REACTION,
        value,
        generator,
    });
};

/**
 * operateFileRecord: Prepares record of entity 'FILE' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateFileRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawFile;
    const record = value.record as File;
    const isCreateAction = action === OperationType.CREATE;

    // id of file comes from server response
    const generator = (file: File) => {
        file._raw.id = isCreateAction ? (raw?.id ?? file.id) : record?.id;
        file.postId = raw.post_id;
        file.name = raw.name;
        file.extension = raw.extension;
        file.size = raw.size;
        file.mimeType = raw?.mime_type ?? '';
        file.width = raw?.width ?? 0;
        file.height = raw?.height ?? 0;
        file.imageThumbnail = raw?.mini_preview ?? '';
        file.localPath = raw?.localPath ?? '';
    };

    return operateBaseRecord({
        action,
        database,
        tableName: FILE,
        value,
        generator,
    });
};

/**
 * operatePostMetadataRecord: Prepares record of entity 'POST_METADATA' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operatePostMetadataRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawPostMetadata;
    const record = value.record as PostMetadata;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (postMeta: PostMetadata) => {
        postMeta._raw.id = isCreateAction ? postMeta.id : record.id;
        postMeta.data = raw.data;
        postMeta.postId = raw.postId;
        postMeta.type = raw.type;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: POST_METADATA,
        value,
        generator,
    });
};

/**
 * operateDraftRecord: Prepares record of entity 'DRAFT' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateDraftRecord = async ({action, database, value}: DataFactoryArgs) => {
    const emptyFileInfo: FileInfo[] = [];
    const raw = value.raw as RawDraft;

    // Draft is client side only; plus you would only be creating/deleting one
    const generator = (draft: Draft) => {
        draft._raw.id = draft.id;
        draft.rootId = raw?.root_id ?? '';
        draft.message = raw?.message ?? '';
        draft.channelId = raw?.channel_id ?? '';
        draft.files = raw?.files ?? emptyFileInfo;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: DRAFT,
        value,
        generator,
    });
};

/**
 * operatePostsInChannelRecord: Prepares record of entity 'POSTS_IN_CHANNEL' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operatePostsInChannelRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawPostsInChannel;
    const record = value.record as PostsInChannel;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (postsInChannel: PostsInChannel) => {
        postsInChannel._raw.id = isCreateAction ? postsInChannel.id : record.id;
        postsInChannel.channelId = raw.channel_id;
        postsInChannel.earliest = raw.earliest;
        postsInChannel.latest = raw.latest;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: POSTS_IN_CHANNEL,
        value,
        generator,
    });
};

/**
 * operateUserRecord: Prepares record of entity 'USER' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateUserRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawUser;
    const record = value.record as User;
    const isCreateAction = action === OperationType.CREATE;

    // id of user comes from server response
    const generator = (user: User) => {
        user._raw.id = isCreateAction ? (raw?.id ?? user.id) : record?.id;
        user.authService = raw.auth_service;
        user.deleteAt = raw.delete_at;
        user.updateAt = raw.update_at;
        user.email = raw.email;
        user.firstName = raw.first_name;
        user.isGuest = raw.roles.includes('system_guest');
        user.lastName = raw.last_name;
        user.lastPictureUpdate = raw.last_picture_update;
        user.locale = raw.locale;
        user.nickname = raw.nickname;
        user.position = raw?.position ?? '';
        user.roles = raw.roles;
        user.username = raw.username;
        user.notifyProps = raw.notify_props;
        user.props = raw.props;
        user.timezone = raw.timezone;
        user.isBot = raw.is_bot;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: USER,
        value,
        generator,
    });
};

/**
 * operatePreferenceRecord: Prepares record of entity 'PREFERENCE' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operatePreferenceRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawPreference;
    const record = value.record as Preference;
    const isCreateAction = action === OperationType.CREATE;

    // id of preference comes from server response
    const generator = (preference: Preference) => {
        preference._raw.id = isCreateAction ? preference.id : record?.id;
        preference.category = raw.category;
        preference.name = raw.name;
        preference.userId = raw.user_id;
        preference.value = raw.value;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: PREFERENCE,
        value,
        generator,
    });
};

/**
 * operatePreferenceRecord: Prepares record of entity 'TEAM_MEMBERSHIP' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateTeamMembershipRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawTeamMembership;
    const record = value.record as TeamMembership;
    const isCreateAction = action === OperationType.CREATE;

    // id of preference comes from server response
    const generator = (teamMembership: TeamMembership) => {
        teamMembership._raw.id = isCreateAction ? teamMembership.id : record?.id;
        teamMembership.teamId = raw.team_id;
        teamMembership.userId = raw.user_id;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: TEAM_MEMBERSHIP,
        value,
        generator,
    });
};

/**
 * operateGroupMembershipRecord: Prepares record of entity 'GROUP_MEMBERSHIP' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateGroupMembershipRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawGroupMembership;
    const record = value.record as GroupMembership;
    const isCreateAction = action === OperationType.CREATE;

    // id of preference comes from server response
    const generator = (groupMember: GroupMembership) => {
        groupMember._raw.id = isCreateAction ? groupMember.id : record?.id;
        groupMember.groupId = raw.group_id;
        groupMember.userId = raw.user_id;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: GROUP_MEMBERSHIP,
        value,
        generator,
    });
};

/**
 * operateChannelMembershipRecord: Prepares record of entity 'CHANNEL_MEMBERSHIP' from the SERVER database for update or create actions.
 * @param {DataFactoryArgs} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateChannelMembershipRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawChannelMembership;
    const record = value.record as ChannelMembership;
    const isCreateAction = action === OperationType.CREATE;

    // id of preference comes from server response
    const generator = (channelMember: ChannelMembership) => {
        channelMember._raw.id = isCreateAction ? channelMember.id : record?.id;
        channelMember.channelId = raw.channel_id;
        channelMember.userId = raw.user_id;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: CHANNEL_MEMBERSHIP,
        value,
        generator,
    });
};

/**
 * operateGroupRecord: Prepares record of entity 'GROUP' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateGroupRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawGroup;
    const record = value.record as Group;
    const isCreateAction = action === OperationType.CREATE;

    // id of preference comes from server response
    const generator = (group: Group) => {
        group._raw.id = isCreateAction ? (raw?.id ?? group.id) : record?.id;
        group.name = raw.name;
        group.displayName = raw.display_name;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: GROUP,
        value,
        generator,
    });
};

/**
 * operateGroupsInTeamRecord: Prepares record of entity 'GROUPS_IN_TEAM' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateGroupsInTeamRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawGroupsInTeam;
    const record = value.record as GroupsInTeam;
    const isCreateAction = action === OperationType.CREATE;

    // FIXME : should include memberCount and timezoneCount or will it be by update action?

    const generator = (groupsInTeam: GroupsInTeam) => {
        groupsInTeam._raw.id = isCreateAction ? groupsInTeam.id : record?.id;
        groupsInTeam.teamId = raw.team_id;
        groupsInTeam.groupId = raw.group_id;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: GROUPS_IN_TEAM,
        value,
        generator,
    });
};

/**
 * operateGroupsInChannelRecord: Prepares record of entity 'GROUPS_IN_CHANNEL' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateGroupsInChannelRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawGroupsInChannel;
    const record = value.record as GroupsInChannel;
    const isCreateAction = action === OperationType.CREATE;

    // FIXME : should include memberCount and timezoneCount or will it be by update action?
    const generator = (groupsInChannel: GroupsInChannel) => {
        groupsInChannel._raw.id = isCreateAction ? groupsInChannel.id : record?.id;
        groupsInChannel.channelId = raw.channel_id;
        groupsInChannel.groupId = raw.group_id;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: GROUPS_IN_CHANNEL,
        value,
        generator,
    });
};

/**
 * operateTeamRecord: Prepares record of entity 'TEAM' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateTeamRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawTeam;
    const record = value.record as Team;
    const isCreateAction = action === OperationType.CREATE;

    // id of team comes from server response
    const generator = (team: Team) => {
        team._raw.id = isCreateAction ? (raw?.id ?? team.id) : record?.id;
        team.isAllowOpenInvite = raw.allow_open_invite;
        team.description = raw.description;
        team.displayName = raw.display_name;
        team.name = raw.name;
        team.updateAt = raw.update_at;
        team.type = raw.type;
        team.allowedDomains = raw.allowed_domains;
        team.isGroupConstrained = Boolean(raw.group_constrained);
        team.lastTeamIconUpdatedAt = raw.last_team_icon_update;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: TEAM,
        value,
        generator,
    });
};

/**
 * operateTeamChannelHistoryRecord: Prepares record of entity 'TEAM_CHANNEL_HISTORY' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateTeamChannelHistoryRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawTeamChannelHistory;
    const record = value.record as TeamChannelHistory;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (teamChannelHistory: TeamChannelHistory) => {
        teamChannelHistory._raw.id = isCreateAction ? (teamChannelHistory.id) : record?.id;
        teamChannelHistory.teamId = raw.team_id;
        teamChannelHistory.channelIds = raw.channel_ids;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: TEAM_CHANNEL_HISTORY,
        value,
        generator,
    });
};

/**
 * operateTeamSearchHistoryRecord: Prepares record of entity 'TEAM_SEARCH_HISTORY' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateTeamSearchHistoryRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawTeamSearchHistory;
    const record = value.record as TeamSearchHistory;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (teamSearchHistory: TeamSearchHistory) => {
        teamSearchHistory._raw.id = isCreateAction ? (teamSearchHistory.id) : record?.id;
        teamSearchHistory.createdAt = raw.created_at;
        teamSearchHistory.displayTerm = raw.display_term;
        teamSearchHistory.term = raw.term;
        teamSearchHistory.teamId = raw.team_id;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: TEAM_SEARCH_HISTORY,
        value,
        generator,
    });
};

/**
 * operateSlashCommandRecord: Prepares record of entity 'SLASH_COMMAND' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateSlashCommandRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawSlashCommand;
    const record = value.record as SlashCommand;
    const isCreateAction = action === OperationType.CREATE;

    // id of team comes from server response
    const generator = (slashCommand: SlashCommand) => {
        slashCommand._raw.id = isCreateAction ? (raw?.id ?? slashCommand.id) : record?.id;
        slashCommand.isAutoComplete = raw.auto_complete;
        slashCommand.description = raw.description;
        slashCommand.displayName = raw.display_name;
        slashCommand.hint = raw.auto_complete_hint;
        slashCommand.method = raw.method;
        slashCommand.teamId = raw.team_id;
        slashCommand.token = raw.token;
        slashCommand.trigger = raw.trigger;
        slashCommand.updateAt = raw.update_at;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: SLASH_COMMAND,
        value,
        generator,
    });
};

/**
 * operateMyTeamRecord: Prepares record of entity 'MY_TEAM' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateMyTeamRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawMyTeam;
    const record = value.record as MyTeam;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (myTeam: MyTeam) => {
        myTeam._raw.id = isCreateAction ? myTeam.id : record?.id;
        myTeam.teamId = raw.team_id;
        myTeam.roles = raw.roles;
        myTeam.isUnread = raw.is_unread;
        myTeam.mentionsCount = raw.mentions_count;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: MY_TEAM,
        value,
        generator,
    });
};

/**
 * operateChannelRecord: Prepares record of entity 'CHANNEL' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateChannelRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawChannel;
    const record = value.record as Channel;
    const isCreateAction = action === OperationType.CREATE;

    // id of team comes from server response
    const generator = (channel: Channel) => {
        channel._raw.id = isCreateAction ? (raw?.id ?? channel.id) : record?.id;
        channel.createAt = raw.create_at;
        channel.creatorId = raw.creator_id;
        channel.deleteAt = raw.delete_at;
        channel.displayName = raw.display_name;
        channel.isGroupConstrained = Boolean(raw.group_constrained);
        channel.name = raw.name;
        channel.teamId = raw.team_id;
        channel.type = raw.type;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: CHANNEL,
        value,
        generator,
    });
};

/**
 * operateMyChannelSettingsRecord: Prepares record of entity 'MY_CHANNEL_SETTINGS' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateMyChannelSettingsRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawMyChannelSettings;
    const record = value.record as MyChannelSettings;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (myChannelSetting: MyChannelSettings) => {
        myChannelSetting._raw.id = isCreateAction ? myChannelSetting.id : record?.id;
        myChannelSetting.channelId = raw.channel_id;
        myChannelSetting.notifyProps = raw.notify_props;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: MY_CHANNEL_SETTINGS,
        value,
        generator,
    });
};

/**
 * operateChannelInfoRecord: Prepares record of entity 'CHANNEL_INFO' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateChannelInfoRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawChannelInfo;
    const record = value.record as ChannelInfo;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (channelInfo: ChannelInfo) => {
        channelInfo._raw.id = isCreateAction ? channelInfo.id : record?.id;
        channelInfo.channelId = raw.channel_id;
        channelInfo.guestCount = raw.guest_count;
        channelInfo.header = raw.header;
        channelInfo.memberCount = raw.member_count;
        channelInfo.pinned_post_count = raw.pinned_post_count;
        channelInfo.purpose = raw.purpose;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: CHANNEL_INFO,
        value,
        generator,
    });
};

/**
 * operateMyChannelRecord: Prepares record of entity 'MY_CHANNEL' from the SERVER database for update or create actions.
 * @param {DataFactory} operator
 * @param {Database} operator.database
 * @param {MatchExistingRecord} operator.value
 * @returns {Promise<Model>}
 */
export const operateMyChannelRecord = async ({action, database, value}: DataFactoryArgs) => {
    const raw = value.raw as RawMyChannel;
    const record = value.record as MyChannel;
    const isCreateAction = action === OperationType.CREATE;

    const generator = (myChannel: MyChannel) => {
        myChannel._raw.id = isCreateAction ? myChannel.id : record?.id;
        myChannel.channelId = raw.channel_id;
        myChannel.roles = raw.roles;
        myChannel.messageCount = raw.message_count;
        myChannel.mentionsCount = raw.mentions_count;
        myChannel.lastPostAt = raw.last_post_at;
        myChannel.lastViewedAt = raw.last_viewed_at;
    };

    return operateBaseRecord({
        action,
        database,
        tableName: MY_CHANNEL,
        value,
        generator,
    });
};

/**
 * operateBaseRecord:  This is the last step for each operator and depending on the 'action', it will either prepare an
 * existing record for UPDATE or prepare a collection for CREATE
 *
 * @param {DataFactoryArgs} operatorBase
 * @param {Database} operatorBase.database
 * @param {string} operatorBase.tableName
 * @param {MatchExistingRecord} operatorBase.value
 * @param {((DataFactoryArgs) => void)} operatorBase.generator
 * @returns {Promise<Model>}
 */
const operateBaseRecord = async ({action, database, tableName, value, generator}: DataFactoryArgs): Promise<Model> => {
    if (action === OperationType.UPDATE) {
    // Two possible scenarios:
    // 1. We are dealing with either duplicates here and if so, we'll update instead of create
    // 2. This is just a normal update operation

        const record = value.record as Model;
        return record.prepareUpdate(() => generator!(record));
    }

    // Two possible scenarios
    // 1. We don't have a record yet to update; so we create it
    // 2. This is just a normal create operation
    return database.collections.get(tableName!).prepareCreate(generator);
};