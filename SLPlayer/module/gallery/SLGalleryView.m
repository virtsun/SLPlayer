//
//  SLGalleryView.m
//  SLPlayer
//
//  Created by l.t.zero on 2017/10/26.
//  Copyright © 2017年 l.t.zero. All rights reserved.
//

#import "SLGalleryView.h"
#import "SLGalleryLayout.h"
#import "macro.h"
#import <iCarousel/iCarousel.h>

@interface SLGalleryView()<iCarouselDataSource, iCarouselDelegate>

@property(nonatomic, strong) iCarousel *carousel;
@property(nonatomic, copy) NSArray<PHAsset*> *photos;
@end


@implementation SLGalleryView

- (id)initWithFrame:(CGRect)frame{
    
    if (self = [super initWithFrame:frame]){
        _carousel = [[iCarousel alloc] initWithFrame:frame];

        _carousel.type = iCarouselTypeCoverFlow2;
        _carousel.vertical = NO;
        
        _carousel.dataSource = self;
        _carousel.delegate = self;
        
        [self addSubview:_carousel];
        
        [SLGallery requestAuthorizedAndFetchPhotos:^(NSArray<PHAsset *> *array) {
            dispatch_main_async_safe(^{
                self.photos = array;
                [self.carousel reloadData];
            });
      
        }];
    }
    
    return self;
}

- (void)layoutSubviews{
    [super layoutSubviews];
    _carousel.frame = self.bounds;
}

#pragma mark --
#pragma mark -- iCarousel
- (NSInteger)numberOfItemsInCarousel:(iCarousel *)carousel{
    //return the total number of items in the carousel
    return _photos.count;
}

- (UIView *)carousel:(iCarousel *)carousel viewForItemAtIndex:(NSInteger)index reusingView:(UIView *)view{
   
    if (!view){
        view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 300, 300.f * 16/9)];
        view.backgroundColor = UIColorFromRGB(arc4random());
        view.layer.cornerRadius = 5;
        view.layer.shadowColor = [UIColor grayColor].CGColor;
        view.layer.shadowOffset = CGSizeMake(2, 2);
        view.layer.shadowOpacity = 1.f;
        view.layer.masksToBounds = YES;
    }
    
    PHAsset *asset = _photos[index];
    view.frame = CGRectMake(0, 0, 200, asset.pixelHeight * 200.f / asset.pixelWidth);
    
    [SLGallery fetchImageWithPHAsset:asset
                           completed:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
                               view.layer.contents = (id)result.CGImage;
                           }];
    return view;
}

- (CGFloat)carousel:(iCarousel *)carousel valueForOption:(iCarouselOption)option withDefault:(CGFloat)value{
    if (option == iCarouselOptionSpacing){
        return value * 1.1;
    }
    return value;
}
- (void)carousel:(iCarousel *)carousel didSelectItemAtIndex:(NSInteger)index{
    if ([_delegate respondsToSelector:@selector(SLGallery:didSelectedItem:)]){
        [_delegate SLGallery:self didSelectedItem:_photos[index]];
    }
}

@end
