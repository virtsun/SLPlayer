//
//  SLGallery.h
//  SLPlayer
//
//  Created by l.t.zero on 2017/10/26.
//  Copyright © 2017年 l.t.zero. All rights reserved.
//

#import <Foundation/Foundation.h>
@import Photos;

@interface SLGallery : NSObject

+ (void)requestAuthorizedAndFetchPhotos:(void (^_Nullable)(NSArray<PHAsset*> * _Nullable asset))completion;
+ (void)fetchImageWithPHAsset:(PHAsset * _Nullable)asset completed:(void (^_Nullable)(UIImage * _Nullable result, NSDictionary * _Nullable info))completion;

+ (void)fetchVideoPathFromPHAsset:(PHAsset *)asset Complete:(void(^)(AVURLAsset *, CGFloat))result;


@end
