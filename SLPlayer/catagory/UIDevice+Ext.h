//
//  UIDevice+Ext.h
//  funlive
//
//  Created by l.t.zero on 16/8/18.
//  Copyright © 2016年 renzhen. All rights reserved.
//

#import <UIKit/UIKit.h>

#define isIPhoneX() [UIDevice iPhoneX]

@interface UIDevice(Ext)

+ (NSString *)platform;
+ (BOOL)iPhoneX;
- (NSInteger)availableVersion:(NSString*)version;

+ (BOOL)beforePlatform:(NSUInteger)version;

@end
