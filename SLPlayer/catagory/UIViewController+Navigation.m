//
// Created by YHL on 2017/10/26.
// Copyright (c) 2017 l.t.zero. All rights reserved.
//

#import "UIViewController+Navigation.h"
#import "UIView+Ext.h"

@implementation UIViewController(Navigation)


-(void)clearNavigationBarBackgroundColor{
    UINavigationBar *bar = self.navigationController.navigationBar;
    UIImageView* blackLineImageView = [self findHairlineImageViewUnder:self.navigationController.navigationBar];
    blackLineImageView.hidden = YES;
    /*添加自己的线*/
//    UIView *shadow = [[UIView alloc] init];
//    shadow.frame = CGRectMake(0, CGRectGetHeight(bar.frame), CGRectGetWidth(bar.frame), 0.5f);
//    shadow.backgroundColor = UIColorFromRGB(0xffffff);
//    [bar addSubview:shadow];

    NSMutableArray *array = [@[] mutableCopy];
    if ([bar findSubView:[UIVisualEffectView class] allSameType:YES container:array]){
        [array enumerateObjectsUsingBlock:^(UIView * obj, NSUInteger idx, BOOL *stop) {
            obj.hidden = YES;
        }];
    }
}
- (UIImageView *)findHairlineImageViewUnder:(UIView *)view{
    if ([view isKindOfClass:UIImageView.class] && view.bounds.size.height <= 1.0){
        return (UIImageView *)view;
    }
    for (UIView *subview in view.subviews) {
        UIImageView *imageView = [self findHairlineImageViewUnder:subview];
        if (imageView) {
            return imageView;
        }
    }
    return nil;
}

@end
