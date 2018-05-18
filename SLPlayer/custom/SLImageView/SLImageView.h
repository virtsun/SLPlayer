//
//  SLImageView.h
//  Coin
//
//  Created by l.t.zero on 2018/5/17.
//  Copyright © 2018年 l.t.zero. All rights reserved.
//

@import Foundation;
@import UIKit;

@interface SLImageViewAdapter: NSObject<CALayerDelegate>

@property (nonatomic, weak) UIImage *image;

@end

@interface SLImageView : UIView

@property (nonatomic, assign) NSInteger pixelCount;

- (id)initWithContentFile:(NSString *)file;

@end
