//
//  NSObject+Swizzling.h
//  RuntimeDemo
//
//  Created by huangyibiao on 16/1/12.
//  Copyright © 2016年 huangyibiao. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSObject(Swizzling)

- (void)ignore;//unrecognized selector sent to instance

+ (void)swizzleSelector:(SEL)originalSelector withSwizzledSelector:(SEL)swizzledSelector;
+ (void)swizzleClassSelector:(SEL)originalSelector withSwizzledSelector:(SEL)swizzledSelector;

@end
