/*
 * Copyright @ 2018-present 8x8, Inc.
 * Copyright @ 2017-2018 Atlassian Pty Ltd
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

#import "AppDelegate.h"
#import "FIRUtilities.h"
#import "Types.h"

#import <JitsiMeet/JitsiMeet.h>
#import "Orientation.h"
#import <React/RCTLinkingManager.h>

@import Crashlytics;
@import Fabric;
@import Firebase;


@implementation AppDelegate

-             (BOOL)application:(UIApplication *)application
  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    // Initialize Crashlytics and Firebase if a valid GoogleService-Info.plist file was provided.
    if ([FIRUtilities appContainsRealServiceInfoPlist]) {
        NSLog(@"Enablign Crashlytics and Firebase");
        [FIRApp configure];
        [Fabric with:@[[Crashlytics class]]];
    }

    // Set the conference activity type defined in this application.
    // This cannot be defined by the SDK.
    JitsiMeetView.conferenceActivityType = JitsiMeetConferenceActivityType;

    return [JitsiMeetView application:application
        didFinishLaunchingWithOptions:launchOptions];
}

#pragma mark Linking delegate methods

-    (BOOL)application:(UIApplication *)application
  continueUserActivity:(NSUserActivity *)userActivity
    restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *restorableObjects))restorationHandler {
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

//- (BOOL)application:(UIApplication *)app
//            openURL:(NSURL *)url
//            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//
//    NSURL *openUrl = url;
//
//    if ([FIRUtilities appContainsRealServiceInfoPlist]) {
//        // Process Firebase Dynamic Links
//        FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];
//        if (dynamicLink != nil) {
//            NSURL *dynamicLinkURL = dynamicLink.url;
//            if (dynamicLinkURL != nil
//                    && (dynamicLink.matchType == FIRDLMatchTypeUnique
//                        || dynamicLink.matchType == FIRDLMatchTypeDefault)) {
//                // Strong match, process it.
//                openUrl = dynamicLinkURL;
//            }
//        }
//    }
//
//    return [JitsiMeetView application:app
//                              openURL:openUrl
//                              options:options];
//}
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    return [Orientation getOrientation];
}

@end

