//
// Created by L.T.ZERO on 2017/10/26.
// Copyright (c) 2017 l.t.zero. All rights reserved.
//

#import "SLHamburgerButton.h"


static const CGFloat kMenuStrokeStart = 0.325f;
static const CGFloat kMenuStrokeEnd = 0.9f;
static const CGFloat kHamburgerStrokeStart = 0.028f;
static const CGFloat kHamburgerStrokeEnd = 0.111f;

@interface SLHamburgerButton ()

@property (nonatomic, assign) CGMutablePathRef shortStrokePath;
@property (nonatomic, assign) CGMutablePathRef outlinePath;
@property (nonatomic, strong) CAShapeLayer *topLayer;
@property (nonatomic, strong) CAShapeLayer *middleLayer;
@property (nonatomic, strong) CAShapeLayer *bottomLayer;

@end

@implementation SLHamburgerButton


- (id)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        [self configLayer];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self configLayer];
    }
    return self;
}

- (void)configLayer {
    // init
    self.topLayer = [CAShapeLayer layer];
    self.topLayer.path = self.shortStrokePath;
    self.middleLayer = [CAShapeLayer layer];
    self.middleLayer.path = self.outlinePath;
    self.bottomLayer = [CAShapeLayer layer];
    self.bottomLayer.path = self.shortStrokePath;

    // 添加属性
    for (CAShapeLayer *layer in @[self.topLayer, self.middleLayer, self.bottomLayer]) {
        // 设置基本属性
        layer.fillColor = nil;
        layer.strokeColor = [UIColor whiteColor].CGColor;
        layer.lineWidth = 4.f;
        layer.miterLimit = 4.f;
        layer.lineCap = kCALineCapRound;
        layer.masksToBounds = YES;
        // 创建一个共享的路径
        CGPathRef strokingPath = CGPathCreateCopyByStrokingPath(layer.path, nil, 4, kCGLineCapRound,kCGLineJoinMiter, 4);
        layer.bounds = CGPathGetPathBoundingBox(strokingPath);
        layer.actions = @{
                @"strokeStart":[NSNull null],
                @"strokeEnd":[NSNull null],
                @"transform":[NSNull null]
        };
        // 添加到 layer 上
        [self.layer addSublayer:layer];

    }
    // 确定其位置
    self.topLayer.anchorPoint = CGPointMake(28.0/30.0, 0.5);
    self.topLayer.position = CGPointMake(40, 18);

    self.middleLayer.position = CGPointMake(27, 27);
    self.middleLayer.strokeStart = kHamburgerStrokeStart;
    self.middleLayer.strokeEnd = kHamburgerStrokeEnd;

    self.bottomLayer.anchorPoint = CGPointMake(28.0 / 30.0, 0.5);
    self.bottomLayer.position = CGPointMake(40, 36);
}

- (void)setTintColor:(UIColor *)tintColor {
    [super setTintColor:tintColor];

    self.topLayer.strokeColor = tintColor.CGColor;
    self.middleLayer.strokeColor = tintColor.CGColor;
    self.bottomLayer.strokeColor = tintColor.CGColor;

}

- (void)setSelected:(BOOL)selected {
    [super setSelected:selected];
    // 中间那条线的处理
    CABasicAnimation *strokeStart = [CABasicAnimation animationWithKeyPath:@"strokeStart"];
    CABasicAnimation *strokeEnd = [CABasicAnimation animationWithKeyPath:@"strokeEnd"];
    /**
     *  注意CAMediaTimingFunction 是一个贝塞尔曲线的控制方法，可以令动画做到先慢後快或先快後慢的结果
     */
    if (selected) {
        strokeStart.toValue = @(kMenuStrokeStart);
        strokeStart.duration = 0.5;
        strokeStart.timingFunction = [CAMediaTimingFunction functionWithControlPoints:0.25 :-0.4 :0.5 :1];

        strokeEnd.toValue = @(kMenuStrokeEnd);
        strokeEnd.duration = 0.6;
        strokeEnd.timingFunction = [CAMediaTimingFunction functionWithControlPoints:0.25 :-0.4 :0.5 :1];
    }else {
        strokeStart.toValue = @(kHamburgerStrokeStart);
        strokeStart.duration = 0.5;
        strokeStart.timingFunction = [CAMediaTimingFunction functionWithControlPoints:0.25: 0 : 0.5 : 1.2];
        strokeStart.beginTime = CACurrentMediaTime() + 0.1;
        strokeStart.fillMode = kCAFillModeBackwards;

        strokeEnd.toValue = @(kHamburgerStrokeEnd);
        strokeEnd.duration = 0.6;
        strokeEnd.timingFunction = [CAMediaTimingFunction functionWithControlPoints:0.25 : 0.3 : 0.5 : 0.9];
    }

    [self addAnimationWithLayer:self.middleLayer animation:strokeStart];
    [self addAnimationWithLayer:self.middleLayer animation:strokeEnd];

    // 底部和上部的线
    CABasicAnimation *topTransform = [CABasicAnimation animationWithKeyPath:@"transform"];
    topTransform.timingFunction = [CAMediaTimingFunction functionWithControlPoints:0.5 :-0.8 :0.5 :1.85];
    topTransform.duration = 0.4;
    topTransform.fillMode = kCAFillModeBackwards;
    /**
     *  CATransform3D 动作效果
     */

    CABasicAnimation *bottomTransform = topTransform.copy;
    if (selected) {
        CATransform3D translation = CATransform3DMakeTranslation(-4, 0, 0);
        topTransform.toValue = [NSValue valueWithCATransform3D: CATransform3DRotate(translation, -0.7853975, 0, 0, 1)];
        topTransform.beginTime = CACurrentMediaTime() + 0.25;

        bottomTransform.toValue = [NSValue valueWithCATransform3D: CATransform3DRotate(translation, 0.7853975, 0, 0, 1)];
        bottomTransform.beginTime = CACurrentMediaTime() + 0.25;
    } else {
        topTransform.toValue = [NSValue valueWithCATransform3D:CATransform3DIdentity];
        topTransform.beginTime = CACurrentMediaTime() + 0.05;

        bottomTransform.toValue = [NSValue valueWithCATransform3D:CATransform3DIdentity];
        bottomTransform.beginTime = CACurrentMediaTime() + 0.05;
    }

    [self addAnimationWithLayer:self.topLayer animation:topTransform];
    [self addAnimationWithLayer:self.bottomLayer animation:bottomTransform];

}

- (void)addAnimationWithLayer:(CAShapeLayer *)layer animation:(CABasicAnimation *)animation{

    if (animation.fromValue == nil) {
        animation.fromValue = [layer.presentationLayer valueForKeyPath:animation.keyPath];
    }
    [layer addAnimation:animation forKey:animation.keyPath];
    // 记住需要重新设置一下，让其达到实现效果
    [layer setValue:animation.toValue forKey:animation.keyPath];
}

- (CGMutablePathRef)shortStrokePath {
    if (!_shortStrokePath) {
        _shortStrokePath = CGPathCreateMutable();
        CGPathMoveToPoint(_shortStrokePath, nil, 2, 2);
        CGPathAddLineToPoint(_shortStrokePath, nil, 28, 2);
    }
    return _shortStrokePath;
}

- (CGMutablePathRef)outlinePath {
    if (!_outlinePath) {
        _outlinePath = CGPathCreateMutable();
        CGPathMoveToPoint(_outlinePath, nil, 10, 27);
        CGPathAddCurveToPoint(_outlinePath, nil, 12.00, 27.00, 28.02, 27.00, 40, 27);
        CGPathAddCurveToPoint(_outlinePath, nil, 55.92, 27.00, 50.47,  2.00, 27,  2);
        CGPathAddCurveToPoint(_outlinePath, nil, 13.16,  2.00,  2.00, 13.16,  2, 27);
        CGPathAddCurveToPoint(_outlinePath, nil,  2.00, 40.84, 13.16, 52.00, 27, 52);
        CGPathAddCurveToPoint(_outlinePath, nil, 40.84, 52.00, 52.00, 40.84, 52, 27);
        CGPathAddCurveToPoint(_outlinePath, nil, 52.00, 13.16, 42.39,  2.00, 27,  2);
        CGPathAddCurveToPoint(_outlinePath, nil, 13.16,  2.00,  2.00, 13.16,  2, 27);
    }
    return _outlinePath;
}

@end