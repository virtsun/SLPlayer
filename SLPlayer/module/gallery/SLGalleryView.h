//
//  SLGalleryView.h
//  SLPlayer
//
//  Created by l.t.zero on 2017/10/26.
//  Copyright © 2017年 l.t.zero. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "SLGallery.h"

@class SLGalleryView;
@protocol SLGalleryViewDelegate<NSObject>

- (void)SLGallery:(SLGalleryView *)gallery didSelectedItem:(PHAsset *)asset;

@end

@interface SLGalleryView : UIView

@property(nonatomic, weak) id<SLGalleryViewDelegate> delegate;

@end
