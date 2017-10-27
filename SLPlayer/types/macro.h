//
//  Macro.h
//
//  Created by sunlantao on 16/2/14.
//  Copyright (c) 2015年 sunlantao. All rights reserved.
//

/**
 *  强弱引用转换，用于解决代码块（block）与强引用self之间的循环引用问题
 *  调用方式: `@weakify_self`实现弱引用转换，`@strongify_self`实现强引用转换
 *
 *  示例：
 *  @weakify_self
 *  [obj block:^{
 *  @strongify_self
 *      self.property = something;
 *  }];
 */
#ifndef	weakify_self
#if __has_feature(objc_arc)
#define weakify_self autoreleasepool{} __weak __typeof__(self) weakSelf = self;
#else
#define weakify_self autoreleasepool{} __block __typeof__(self) blockSelf = self;
#endif
#endif
#ifndef	strongify_self
#if __has_feature(objc_arc)
#define strongify_self try{} @finally{} __typeof__(weakSelf) self = weakSelf;
#else
#define strongify_self try{} @finally{} __typeof__(blockSelf) self = blockSelf;
#endif
#endif

/**
 *  强弱引用转换，用于解决代码块（block）与强引用对象之间的循环引用问题
 *  调用方式: `@weakify(object)`实现弱引用转换，`@strongify(object)`实现强引用转换
 *
 *  示例：
 *  @weakify(object)
 *  [obj block:^{
 *      @strongify(object)
 *      strong_object = something;
 *  }];
 */
#ifndef	weakify
#if __has_feature(objc_arc)
#define weakify(object)	autoreleasepool{} __weak __typeof__(object) weak##_##object = object;
#else
#define weakify(object)	autoreleasepool{} __block __typeof__(object) block##_##object = object;
#endif
#endif
#ifndef	strongify
#if __has_feature(objc_arc)
#define strongify(object) try{} @finally{} __typeof__(object) strong##_##object = weak##_##object;
#else
#define strongify(object) try{} @finally{} __typeof__(object) strong##_##object = block##_##object;
#endif
#endif

#ifndef dispatch_main_async_safe
#define dispatch_main_async_safe(block)\
if (strcmp(dispatch_queue_get_label(DISPATCH_CURRENT_QUEUE_LABEL), dispatch_queue_get_label(dispatch_get_main_queue())) == 0) {\
block();\
} else {\
dispatch_async(dispatch_get_main_queue(), block);\
}
#endif


///IOS 版本判断
#define IOSAVAILABLEVERSION(version) ([[UIDevice currentDevice] availableVersion:version] < 0)
// 当前系统版本
#define CurrentSystemVersion [[UIDevice currentDevice].systemVersion doubleValue]

//-------------------打印日志-------------------------
//DEBUG  模式下打印日志,当前行
#ifdef DEBUG
#define DLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
#else
#define DLog(...)
#endif

//DEBUG  模式下打印日志,当前行
#ifdef DEBUG
#define NSLog(fmt, ...) NSLog((fmt), ##__VA_ARGS__);
#else
#define NSLog(...)
#endif

#define kAppShortVersion [[NSBundle mainBundle].infoDictionary objectForKey:@"CFBundleShortVersionString"]

//根据ip6的屏幕来拉伸
#define kRealValue(with) ((with)*(KScreenWidth/375.0f))


//定义UIImage对象
#define ImageNamed(_pointer) [UIImage imageWithContentsOfFile:([[NSBundle mainBundle] pathForResource:[NSString stringWithFormat:@"%@@%dx", _pointer, (int)[UIScreen mainScreen].nativeScale] ofType:@"png"])]

//十六进制数字转换成颜色
#if !defined(UIColorFromRGBA)
    #define UIColorFromRGBA(rgbValue, a) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:a]
    #define UIColorFromRGB(rgbValue) UIColorFromRGBA(rgbValue, 1.f)
#endif

#define NSStringFromValue(value) [NSString stringWithFormat:@"%@", value]
#define NSURLFromString(str) [NSURL URLWithString:str]
#define NSStringFromCurrentClass() NSStringFromClass([self class])

#define UIMakeCustomButton() [UIButton buttonWithType:UIButtonTypeCustom]

#define UINavigationControllFromViewController(root) [[UINavigationController alloc] initWithRootViewController:root]

#define KCanCamera [UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]

#define dispatch_safe_main(block) if ([NSThread isMainThread]) {block();}else{dispatch_async(dispatch_get_main_queue(),block);}
#define dispatch_sub_thread(block) if ([NSThread isMainThread]) {dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0),block);}else{block();}


/* Background Task */
#if __IPHONE_OS_VERSION_MIN_REQUIRED >= __IPHONE_4_0
#define CBBeginBackgroundTask() \
UIBackgroundTaskIdentifier taskID = UIBackgroundTaskInvalid; \
taskID = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{ \
[[UIApplication sharedApplication] endBackgroundTask:taskID]; }];

#define CBEndBackgroundTask() \
[[UIApplication sharedApplication] endBackgroundTask:taskID];

#else

#define CBBeginBackgroundTask()
#define CBEndBackgroundTask()

#endif

