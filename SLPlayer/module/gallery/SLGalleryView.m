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

        _carousel.type = iCarouselTypeCustom;
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
    view.frame = CGRectMake(0, 0, 300, 200);

    [SLGallery fetchImageWithPHAsset:asset
                           completed:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
                               view.layer.contents = (id)result.CGImage;
                           }];
    return view;
}
- (CATransform3D)carousel:(iCarousel *)carousel itemTransformForOffset:(CGFloat)offset baseTransform:(CATransform3D)transform
{
    static CGFloat max_sacle = 1.0f;
    static CGFloat min_scale = 0.8f;
    if (offset <= 1 && offset >= -1){
        float tempScale = offset < 0 ? 1 + offset : 1 - offset;
        float slope = (max_sacle-min_scale) / 1;
        CGFloat scale = min_scale+slope*tempScale;
        transform = CATransform3DScale(transform, scale, scale, 1);
    }else{
        transform = CATransform3DScale(transform, min_scale, min_scale, 1);
    }
    return CATransform3DTranslate(transform, offset * 300 * 1.2, 0.0, 0.0);
    
}
- (CGFloat)carousel:(iCarousel *)carousel valueForOption:(iCarouselOption)option withDefault:(CGFloat)value
{
    
    //customize carousel display
    switch (option)
    {
        case iCarouselOptionWrap:
        {
            //normally you would hard-code this to YES or NO
            return YES;
        }
        case iCarouselOptionSpacing:
        {
            //add a bit of spacing between the item views
            return value * 1.1f;
        }
        case iCarouselOptionFadeMax:
        case iCarouselOptionShowBackfaces:
        case iCarouselOptionRadius:
        case iCarouselOptionAngle:
        case iCarouselOptionArc:
        case iCarouselOptionTilt:
        case iCarouselOptionCount:
        case iCarouselOptionFadeMin:
        case iCarouselOptionFadeMinAlpha:
        case iCarouselOptionFadeRange:
        case iCarouselOptionOffsetMultiplier:
        case iCarouselOptionVisibleItems:
        {
            return value;
        }
    }
}

- (void)carousel:(iCarousel *)carousel didSelectItemAtIndex:(NSInteger)index{
    if ([_delegate respondsToSelector:@selector(SLGallery:didSelectedItem:)]){
        [_delegate SLGallery:self didSelectedItem:_photos[index]];
    }
}

@end
