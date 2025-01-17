// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useRef} from 'react';
import {type StyleProp, StyleSheet, type ViewStyle} from 'react-native';
import {type Edge, SafeAreaView} from 'react-native-safe-area-context';

import {markChannelAsRead} from '@actions/remote/channel';
import {fetchPostsBefore} from '@actions/remote/post';
import PostList from '@components/post_list';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {debounce} from '@helpers/api/general';
import {useAppState, useIsTablet} from '@hooks/device';

import Intro from './intro';

import type PostModel from '@typings/database/models/servers/post';

type Props = {
    channelId: string;
    contentContainerStyle?: StyleProp<ViewStyle>;
    isCRTEnabled: boolean;
    lastViewedAt: number;
    nativeID: string;
    posts: PostModel[];
    shouldShowJoinLeaveMessages: boolean;
    currentCallBarVisible: boolean;
    joinCallBannerVisible: boolean;
}

const edges: Edge[] = ['bottom'];
const styles = StyleSheet.create({
    flex: {flex: 1},
    containerStyle: {paddingTop: 12},
});

const ChannelPostList = ({
    channelId, contentContainerStyle, isCRTEnabled,
    lastViewedAt, nativeID, posts, shouldShowJoinLeaveMessages,
    currentCallBarVisible, joinCallBannerVisible,
}: Props) => {
    const appState = useAppState();
    const isTablet = useIsTablet();
    const serverUrl = useServerUrl();
    const canLoadPosts = useRef(true);
    const fetchingPosts = useRef(false);

    const oldPostsCount = useRef<number>(posts.length);
    useEffect(() => {
        if (oldPostsCount.current < posts.length && appState === 'active') {
            oldPostsCount.current = posts.length;
            markChannelAsRead(serverUrl, channelId, true);
        }
    }, [isCRTEnabled, posts, channelId, serverUrl, appState === 'active']);

    const onEndReached = useCallback(debounce(async () => {
        if (!fetchingPosts.current && canLoadPosts.current) {
            fetchingPosts.current = true;
            const lastPost = posts[posts.length - 1];
            const result = await fetchPostsBefore(serverUrl, channelId, lastPost?.id || '');
            fetchingPosts.current = false;
            canLoadPosts.current = false;
            if (!('error' in result)) {
                canLoadPosts.current = (result.posts?.length ?? 0) > 0;
            }
        }
    }, 500), [channelId, posts]);

    const intro = (
        <Intro
            channelId={channelId}
            hasPosts={posts.length > 0}
        />
    );

    const postList = (
        <PostList
            channelId={channelId}
            contentContainerStyle={[contentContainerStyle, !isCRTEnabled && styles.containerStyle]}
            isCRTEnabled={isCRTEnabled}
            footer={intro}
            lastViewedAt={lastViewedAt}
            location={Screens.CHANNEL}
            nativeID={nativeID}
            onEndReached={onEndReached}
            posts={posts}
            shouldShowJoinLeaveMessages={shouldShowJoinLeaveMessages}
            showMoreMessages={true}
            testID='channel.post_list'
            currentCallBarVisible={currentCallBarVisible}
            joinCallBannerVisible={joinCallBannerVisible}
        />
    );

    if (isTablet) {
        return postList;
    }

    return (
        <SafeAreaView
            edges={edges}
            style={styles.flex}
        >
            {postList}
        </SafeAreaView>
    );
};

export default ChannelPostList;
