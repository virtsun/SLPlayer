//
// Created by YHL on 2017/10/26.
// Copyright (c) 2017 l.t.zero. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface UIView(Ext)

- (BOOL)findSubView:(Class)class allSameType:(BOOL)same container:(NSMutableArray*)container;
+ (BOOL)findSubView:(Class)class view:(UIView*)v allSameType:(BOOL)same container:(NSMutableArray*)container;

@end