/*
 * Copyright @ 2017-present Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.wehago.meet.sdk;

import java.util.Map;

/**
 * Implements {@link JitsiMeetViewListener} so apps don't have to add stubs for
 * all methods in the interface if they are only interested in some.
 */
public abstract class JitsiMeetViewAdapter
    implements JitsiMeetViewListener {

    @Override
    public void onConferenceFailed(Map<String, Object> data) {
    }

    @Override
    public void onConferenceJoined(Map<String, Object> data) {
    }

    @Override
    public void onConferenceLeft(Map<String, Object> data) {
    }

    @Override
    public void onConferenceWillJoin(Map<String, Object> data) {
    }

    @Override
    public void onConferenceWillLeave(Map<String, Object> data) {
    }

    @Override
    public void onLoadConfigError(Map<String, Object> data) {
    }
}
