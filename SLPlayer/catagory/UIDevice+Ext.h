//
//  UIDevice+Ext.h
//  funlive
//
//  Created by l.t.zero on 16/8/18.
//  Copyright © 2016年 renzhen. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIDevice(Ext)

+ (NSString *)platform;

- (NSInteger)availableVersion:(NSString*)version;

+ (BOOL)beforePlatform:(NSUInteger)version;

@end
