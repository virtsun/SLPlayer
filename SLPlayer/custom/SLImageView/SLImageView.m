//
//  SLImageView.m
//  Coin
//
//  Created by l.t.zero on 2018/5/17.
//  Copyright © 2018年 l.t.zero. All rights reserved.
//

#import "SLImageView.h"

@import QuartzCore;

@interface SLImageView()

@property (nonatomic, strong) UIImage *image;
@property (nonatomic, weak) CATiledLayer *tiledLayer;
@property (nonatomic, strong) SLImageViewAdapter *adapter;

@end

@implementation SLImageView

- (id)initWithContentFile:(NSString *)file{
    
    if (self = [self init]){
        self.image = [UIImage imageWithContentsOfFile:file];
    }
    
    return self;
}

- (id)initWithFrame:(CGRect)frame{
    
    if (self = [super initWithFrame:frame]){
        
        _adapter = [SLImageViewAdapter new];
        
        CGFloat scale = [UIScreen mainScreen].scale;
        
        CATiledLayer *layer = [[CATiledLayer alloc]init];
        layer.delegate = _adapter;
        layer.contentsGravity = kCAGravityResizeAspect;
        layer.contentsScale = scale;
        
        int lev = ceil(log2(1/scale)) + 1;
        layer.levelsOfDetail = 1;
        layer.levelsOfDetailBias = lev;

        self.pixelCount = 10;
        
        [self.layer addSublayer:layer];
        
        self.tiledLayer = layer;
        
    }
    
    return self;
}

- (void)setImage:(UIImage *)image{
    _image = image;
    _adapter.image = image;
    
    [_tiledLayer setNeedsDisplay];
}

- (void)setFrame:(CGRect)frame{
    [super setFrame:frame];

    _tiledLayer.frame = self.bounds;
    self.pixelCount = _pixelCount;
    
    [_tiledLayer setNeedsDisplay];
}

- (void)setPixelCount:(NSInteger)pixelCount{
    _pixelCount = pixelCount;
    
    CGSize size = CGSizeZero;
    if (_pixelCount > 0 && !CGRectEqualToRect(_tiledLayer.bounds, CGRectZero)){
        CGFloat scale = _tiledLayer.contentsScale;
        size = CGSizeMake(MAX(10 * scale, CGRectGetWidth(_tiledLayer.bounds)/(sqrt(_pixelCount))),
                          MAX(10 * scale, CGRectGetHeight(_tiledLayer.bounds)/(sqrt(_pixelCount))));
    }else{
        size = _tiledLayer.bounds.size;
    }
    
    if (!CGSizeEqualToSize(_tiledLayer.tileSize, size)){
        _tiledLayer.tileSize = size;
        [_tiledLayer setNeedsDisplay];
    }
    
}

- (void)setNeedsDisplay{
    [super setNeedsDisplay];
    [_tiledLayer setNeedsDisplay];
}

- (void)dealloc{
    _tiledLayer.delegate = nil;
    _tiledLayer = nil;
}

@end



@interface SLImageViewAdapter()

@end

@implementation SLImageViewAdapter

#pragma mark --
#pragma mark -- CALayerDelegate
- (void)drawLayer:(CATiledLayer *)layer inContext:(CGContextRef)ctx{
    
    if (!self.image || !layer.superlayer){
        NSLog(@"%@ has be removed!!", layer);
        return;
    }
    
    CGRect rect = CGContextGetClipBoundingBox(ctx);
   
    CGFloat imageScale = layer.bounds.size.width/_image.size.width;

    
    CGRect imageCutRect = CGRectMake(rect.origin.x / imageScale,rect.origin.y / imageScale,rect.size.width / imageScale,rect.size.height / imageScale);
    //截取指定图片区域，重绘
    @autoreleasepool{
        CGImageRef imageRef = CGImageCreateWithImageInRect(_image.CGImage, imageCutRect);
        UIImage *tileImage = [UIImage imageWithCGImage:imageRef];
        UIGraphicsPushContext(ctx);
        [tileImage drawInRect:rect];
        UIGraphicsPopContext();

    }
}



@end
