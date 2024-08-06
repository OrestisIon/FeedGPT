
import React, { useState, useEffect, useMemo } from 'react'
import {Allotment} from 'allotment'
import FeedBrowser from './FeedBrowser'
import ItemBrowser from './ItemBrowser'
import ItemViewer from 'pages/ItemViewer'
import { KeyHelpModal, SettingsModal } from './Modals'
import styled from 'styled-components'
import { useHotkeys } from 'react-hotkeys-hook'
import { apiCall, createFeedIcon } from 'lib/util'
import ClickNHold from 'react-click-n-hold'
// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
// react-router-dom components
import { useLocation } from "react-router-dom";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

const ErrorDiv = styled.div`
	padding: 10px;
	background-color: ${(props) => props.theme.errorbg};
	color: ${(props) => props.theme.errorfg};
	text-align: center;
	position: absolute;
	width: 100%;
	z-index: 100;
	font-weight: bold;
`

const ErrorClose = styled.div`
	float: right;
	margin-right: 20px;
`

const FloatingButton = styled.button`
	float: right;
	margin-top: 5px;
	margin-right: 5px;
	font-size: 16px;
	width: 30px;
	height: 30px;
`

const sum = (arr) => {
    return arr.reduce((a, b) => {
        return a + (b['unreads'] || 0)
    }, 0)
}


function AllFeeds() {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav } = controller;
    const { pathname } = useLocation();

    const [error, setError] = useState()
    const [currentFeed, setCurrentFeed] = useState()
    const [currentItem, setCurrentItem] = useState()
    const [feeds, setFeeds] = useState([])

    const [helpOpen, setHelpOpen] = useState(false)

    const [updateFeedsTrigger, setUpdateFeedsTrigger] = useState(true)
    const [renderFeedsTrigger, setRenderFeedsTrigger] = useState(true)
    const [updateUnreadTrigger, setUpdateUnreadTrigger] = useState([])
    

    const [, updateState] = React.useState()
    const forceUpdate = React.useCallback(() => updateState({}), [])

    const cache = useMemo(() => JSON.parse(localStorage.getItem('favicons')) || {}, []);

    useEffect(() => {
        localStorage.setItem('refresh', 60)
        const fetchFeeds = async () => {
            const f = await apiCall('feeds', setError)
            let categories = []
            f.forEach((x) => {
                if (!categories.find((c) => c.id === x.category.id))
                    categories.push(x.category)
            })

            const feedTree = [
                { id: -1, title: 'All', fetch_url: 'entries', unreads: 0 },
                {
                    id: -2,
                    title: 'Starred',
                    fetch_url: 'entries?starred=true',
                    unreads: 0,
                },
            ]

            categories
                .filter((f) => f)
                .sort((a, b) => a.title.localeCompare(b.title))
                .forEach((c) => {
                    feedTree.push(c)
                    feedTree.push(
                        ...f
                            .filter((f) => f.category.id === c.id)
                            .sort((a, b) => a.title.localeCompare(b.title))
                            .map((f) =>
                                Object.assign(f, {
                                    fetch_url: 'feeds/' + f.id + '/entries',
                                    is_feed: true,
                                })
                            )
                    )
                })

            feedTree.forEach(async (f) => {
                f.icon_data = createFeedIcon(f.title)
                if (f.icon && f.id in cache) {
                    f.icon_data = cache[f.id]
                } else if (f.icon) {
                    try {
                        const icon = await apiCall(
                            'feeds/' + f.id + '/icon',
                            (e) => { }
                        )
                        f.icon_data = 'data:' + icon.data
                    } catch { }

                    localStorage.setItem(
                        'favicons',
                        JSON.stringify({
                            ...JSON.parse(localStorage.getItem('favicons')),
                            [f.id]: f.icon_data,
                        })
                    )
                    forceUpdate()
                }
            })
            setFeeds(feedTree)
            setUpdateUnreadTrigger(feedTree)
        }
        if (updateFeedsTrigger) fetchFeeds()
        setUpdateFeedsTrigger(false)
    }, [updateFeedsTrigger, cache, forceUpdate])

    useEffect(() => {
        if (localStorage.getItem('refresh') > 0) {
            let timer = setInterval(
                () => setUpdateFeedsTrigger(true),
                1000 * localStorage.getItem('refresh')
            )
            return () => clearInterval(timer)
        }
        // eslint-disable-next-line
    }, [localStorage.getItem('refresh')])

    useEffect(() => {
        const updateUnread = async (f, state) => {
            if (parseInt(f)) {
                state = feeds
                f = feeds.find((x) => x.id === f && x.fetch_url)
            }
            if (!f.fetch_url) return

            const unread = await apiCall(
                f.fetch_url +
                (f.fetch_url.includes('?') ? '&' : '?') +
                'status=unread&limit=1',
                setError
            )
            f['unreads'] = unread.total
            setRenderFeedsTrigger(true)

            document.title =
                sum(state.filter((f) => f.id > 0 && f.is_feed)) +
                ' | reminiflux'

            state
                .filter((f) => !f.fetch_url)
                .forEach((c) => {
                    c['unreads'] = sum(
                        state.filter(
                            (x) => x.category && x.category.id === c.id
                        )
                    )
                })

            forceUpdate()
        }

        if (updateUnreadTrigger.length > 0) {
            [-2, -1, ...updateUnreadTrigger].forEach((u) =>
                updateUnread(u, updateUnreadTrigger)
            )
            setUpdateUnreadTrigger([])
        }
    }, [feeds, forceUpdate, updateUnreadTrigger])

    const markAllRead = async (f) => {
        const urls = f.fetch_url
            ? [f.fetch_url]
            : feeds
                .filter((x) => x.category)
                .filter((x) => x.category.id === f.id)
                .map((x) => x.fetch_url)

        const result = await Promise.all(
            urls.map(
                (u) =>
                    apiCall(
                        u + (u.includes('?') ? '&' : '?') + '&status=unread'
                    ),
                setError
            )
        )

        const items = []
        result.forEach((i) => items.push(...i.entries))

        if (!items.length) return

        await apiCall('entries', setError, {
            entry_ids: items.map((x) => x.id),
            status: 'read',
        })

        setUpdateUnreadTrigger(
            items
                .map((x) => x.feed.id)
                .filter((f, index, self) => self.indexOf(f) === index)
        )
    }

    const refreshFeedCounts = () => {
        setUpdateUnreadTrigger(feeds.map((x) => x.id))
    }
    
    const refreshFeeds = async () => {
        await apiCall('feeds/refresh', setError, {})
        setUpdateFeedsTrigger(true)
    }
    

    return (
        // <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
        <DashboardLayout>

            <Grid container style={{ height: 'calc(100vh - 64px)' }}> {/* Adjust the height as needed */}
                <Grid item xs={4} style={{ borderRight: '1px solid #e0e0e0', overflow: 'auto' }}>
                    <FloatingButton
                        // onClick={() => setSettingsOpen(true)}
                        title='Settings'>
                        &#9881;
                    </FloatingButton>
                    <ClickNHold
                        time={2}
                        onClickNHold={refreshFeeds}
                        onEnd={(e, enough) => {
                            if (!enough) refreshFeedCounts()
                            e.target.blur()
                        }}>
                        <FloatingButton
                            title='Short press to refresh unread count, 
								long press to trigger fetch and full refresh'>
                            &#8635;
                        </FloatingButton>
                    </ClickNHold>
                    <FeedBrowser
                        currentFeed={currentFeed}
                        feeds={feeds}
                        onFeedChange={setCurrentFeed}
                        markAllRead={markAllRead}
                        errorHandler={setError}
                        updateTrigger={renderFeedsTrigger}
                        clearTrigger={setRenderFeedsTrigger}
                    />
                </Grid>
                <Grid item xs={8} container direction="column">
                    <Grid item style={{ borderBottom: '1px solid #e0e0e0', height: '40%', overflow: 'auto' }}>
                        {/* Top Right Panel */}

							<ItemBrowser
                            currentFeed={currentFeed}
                            currentItem={currentItem}
                            feeds={feeds}
                            onItemChange={setCurrentItem}
                            updateUnread={setUpdateUnreadTrigger}
                            errorHandler={setError}
                        />
                    </Grid>
                    <Grid item style={{ height: '60%', overflow: 'auto' }}>
                        {/* Bottom Right Panel */}
                        <ItemViewer
                            currentItem={currentItem}
                            onFeedChange={(f) =>
                                setCurrentFeed(
                                    feeds.find((i) => i.id === f.id)
                                )
                            }
                            errorHandler={setError}
                        />
                    </Grid>
                </Grid>
            </Grid>
            
        </DashboardLayout>
    );
}

export default AllFeeds;