//
//  SLMonitor.h
//  SLPlayer
//
//  Created by l.t.zero on 2017/11/23.
//  Copyright © 2017年 l.t.zero. All rights reserved.
//

#import <Foundation/Foundation.h>
@import QuartzCore;

@interface SLWeakProxy : NSProxy

@property (nonatomic, weak, readonly) id target;

- (instancetype)initWithTarget:(id)target;
+ (instancetype)proxyWithTarget:(id)target;

@end

@interface SLMonitor : NSObject

@property (nonatomic, readonly) NSInteger cpu;//当前CPU占用率
@property (nonatomic, readonly) NSInteger fps;
@property (nonatomic, readonly) CGFloat memory;

+ (instancetype)monitor;

@end
